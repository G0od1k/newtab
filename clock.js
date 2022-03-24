function drawClock() {
    document.body.style.backgroundColor = `hsl(${Math.random() * 360}, ${
        cfg.bg.s
    }%, ${cfg.bg.l}%)`
    let d = new Date()
    document.querySelector(`#clock`).innerHTML =
        [d.getHours(), d.getMinutes()]
            .map((x) => (`0` + x).slice(-2))
            .join(`:`) + `<small>:${(`0` + d.getSeconds()).slice(-2)}</small>`
}

drawClock()
setInterval(drawClock, 1000)
