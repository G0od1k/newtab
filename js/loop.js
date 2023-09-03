function clockInit(type) {
    const clockNode = document.querySelector(`#clock`)

    clockNode.setAttribute("type", cfg.clockType)

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
            clockNode.classList.toggle("h24", cfg.clock24h)
            arrowClockNumbersParser(cfg.clockNums)
                .slice(0, cfg.clock24h ? 24 : 12)
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
    }
}

function drawClock() {
    if (!cfg.clock) return 0

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
