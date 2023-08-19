function clockInit(type) {
    const clockNode = document.querySelector(`#clock`)

    clearChildren(clockNode)
    ;["H", "M", "S"].slice(0, 2 + cfg.clockSec).forEach((x) => {
        let node = document.createElement("span")

        node.className = "num"
        node.id = "clock" + x

        clockNode.appendChild(node)
    })
}

function drawClock() {
    if (!cfg.clock) return 0

    let d = new Date()

    ;["Hours", "Minutes", "Seconds"].slice(0, 2 + cfg.clockSec).forEach((x) => {
        document.querySelector("#clock" + x.slice(0, 1)).innerText = (
            "0" + d["get" + x]()
        ).slice(-2)
    })
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
