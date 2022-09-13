function drawClock() {
    document.body.style.backgroundColor = `hsl(${Math.random() * 360}, ${
        cfg.bg.s
    }%, ${cfg.bg.l}%)`

    let d = new Date()
    document.querySelector(`#clock`).innerHTML = [
        d.getHours(),
        d.getMinutes(),
        d.getSeconds(),
    ]
        .map((x) => `<span>${(`0` + x).slice(-2)}</span>`)
        .join(`<b>:</b>`)
}

drawClock()
setInterval(drawClock, 1000)
