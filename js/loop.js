function clockInit() {
    const clockNode = document.querySelector(`#clock`)

    clockNode.setAttribute("type", cfg.clockType)
    clockNode.classList.toggle("h24", !cfg.clock12h)

    clearChildren(clockNode)

    switch (cfg.clockType) {
        case "num":
            ;["H", "M", "S"].slice(0, 2 + cfg.clockSec).forEach((x) => {
                let node = document.createElement("span")

                node.className = "num"
                node.id = "clock" + x

                clockNode.appendChild(node)
            })
            break
        case "arr":
            arrowClockNumbersParser(cfg.clockNums)
                .slice(0, cfg.clock12h ? 12 : 24)
                .forEach((x, i) => {
                    let node = document.createElement("div")

                    node.className = "num"
                    node.style.setProperty("--i", i + 1)

                    x.forEach((x, j) => {
                        let num = document.createElement("span")
                        num.style.setProperty("--j", j)
                        num.innerText = x || "\xa0"
                        node.appendChild(num)
                    })

                    clockNode.appendChild(node)
                })
            ;["H", "M", "S"].slice(0, 2 + cfg.clockSec).forEach((x) => {
                let node = document.createElement("div")

                node.className = "arrow"
                node.id = "arrow" + x

                clockNode.appendChild(node)
            })
            break
        case "bin":
            for (let x = 0; x < 2 + cfg.clockSec + cfg.clock12h; x++) {
                for (let y = 0; y < 6; y++) {
                    const plate = document.createElement("div")
                    plate.id = `plate-${x}-${y}`
                    plate.innerText =
                        y == 5 && x == 2 + cfg.clockSec ? "pm" : 2 ** (5 - y)
                    clockNode.appendChild(plate)
                }
            }
            break
        case "bcd":
            for (let x = 0; x < 4 + cfg.clockSec * 2 + cfg.clock12h; x++) {
                for (let y = 0; y < 4; y++) {
                    const plate = document.createElement("div")
                    plate.id = `plate-${x}-${y}`
                    plate.innerText =
                        y == 3 && x == 4 + cfg.clockSec * 2
                            ? "pm"
                            : 2 ** (3 - y)
                    clockNode.appendChild(plate)
                }
            }
            break
    }
}

function drawClock() {
    document.querySelector("#clock").style.display = null
    if (!cfg.clock) {
        document.querySelector("#clock").style.display = "none"
        return 0
    }

    let d = new Date()

    switch (cfg.clockType) {
        case "num":
            ;["Hours", "Minutes", "Seconds"]
                .slice(0, 2 + cfg.clockSec)
                .forEach((x) => {
                    document.querySelector("#clock" + x.slice(0, 1)).innerText =
                        ("0" + d["get" + x]()).slice(-2)
                })
            break
        case "arr":
            ;["Hours", "Minutes", "Seconds"]
                .slice(0, 2 + cfg.clockSec)
                .forEach((x) => {
                    let arrow = document.querySelector("#arrow" + x.slice(0, 1))
                    let value = +arrow.style.getPropertyValue("--a")
                    while (d["get" + x]() != value % (x == "Hours" ? 24 : 60))
                        value++

                    arrow.style.setProperty("--a", value)
                })
            break
        case "bin":
            ;["Hours", "Minutes", "Seconds"]
                .slice(0, 2 + cfg.clockSec)
                .map((x) => {
                    let num = d["get" + x]()
                    if (x == "Hours" && cfg.clock12h) num = num % 12 || 12 // 12 hours format
                    return num
                })
                .forEach((n, x) => {
                    n.toString(2)
                        .padStart(6, 0)
                        .split("")
                        .forEach((a, y) => {
                            document
                                .querySelector(`#plate-${x}-${y}`)
                                .classList.toggle("a", +a)
                        })
                })
            if (cfg.clock12h) {
                document
                    .querySelector(`#clock`)
                    .lastChild.classList.toggle("a", d.getHours() > 11)
            }
            break
        case "bcd":
            ;["Hours", "Minutes", "Seconds"]
                .slice(0, 2 + cfg.clockSec)
                .map((x) => {
                    let num = d["get" + x]()
                    if (x == "Hours" && cfg.clock12h) num = num % 12 || 12 // 12 hours format
                    return num.toString().padStart(2, 0).split("")
                })
                .flat()
                .forEach((n, x) => {
                    parseInt(n)
                        .toString(2)
                        .padStart(4, 0)
                        .split("")
                        .forEach((a, y) => {
                            document
                                .querySelector(`#plate-${x}-${y}`)
                                .classList.toggle("a", +a)
                        })
                })
            if (cfg.clock12h) {
                document
                    .querySelector(`#clock`)
                    .lastChild.classList.toggle("a", d.getHours() > 11)
            }
            break
    }
}

function bgUpdate() {
    function change(value) {
        const bg = document.querySelector(`#bg`)

        bg.style.background = value
        bg.style.opacity = 1

        setTimeout(() => {
            document.body.style.background = bg.style.background
            bg.style.opacity = 0
        }, 500)
    }

    switch (cfg.bgType) {
        case "color":
            change(
                `hsl(${Math.random() * 360}, ${cfg.bgSaturate}%, ${
                    cfg.bgLight
                }%)`
            )
            break
        case "lGrad":
            change(
                `linear-gradient(${~~(Math.random() * 360)}deg, ${new Array(
                    cfg.bgGradColCount
                )
                    .fill()
                    .map(
                        (x) =>
                            `hsl(${Math.random() * 360}, ${cfg.bgSaturate}%, ${
                                cfg.bgLight
                            }%)`
                    )
                    .join()}) fixed`
            )
            break
        case "rGrad":
            change(
                `radial-gradient(circle, ${new Array(cfg.bgGradColCount)
                    .fill()
                    .map(
                        (x) =>
                            `hsl(${Math.random() * 360}, ${cfg.bgSaturate}%, ${
                                cfg.bgLight
                            }%)`
                    )
                    .join()}) fixed`
            )
            break
        case "image":
            let URIs = cfg.bgURIs.split(`\n`)
            change(
                `url(${
                    URIs[~~(URIs.length * Math.random())]
                }) center/cover no-repeat fixed`
            )
            break
        default:
            break
    }
}

let intervals = []

function loops() {
    clockInit()

    intervals.forEach((id) => clearInterval(id))
    intervals = []
    ;[
        [drawClock, "clockUpdTime"],
        [bgUpdate, "bgUpdTime"],
    ].forEach((loop) => {
        loop[0]()
        intervals.push(setInterval(loop[0], cfg[loop[1]]))
    })
}
