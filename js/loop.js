function drawClock() {
    if (!cfg.clock) return 0

    let d = new Date()
    document.querySelector(`#clock`).innerHTML = [
        d.getHours(),
        d.getMinutes(),
        d.getSeconds(),
    ]
        .slice(0, 2 + cfg.clockSec)
        .map((x) => `<span>${(`0` + x).slice(-2)}</span>`)
        .join(`<b>:</b>`)
}

function bgUpdate() {
    document.body.style.background = `hsl(${Math.random() * 360}, ${
        cfg.bgSaturate
    }%, ${cfg.bgLight}%)`
}

let intervals = []

function loops() {
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
