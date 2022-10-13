function drawClock() {
    document.body.style.backgroundColor = `hsl(${Math.random() * 360}, ${
        cfg.bgSaturate
    }%, ${cfg.bgLight}%)`

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
