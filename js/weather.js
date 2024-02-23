function weather() {
    document.querySelector("#weather").hidden = false
    if (!cfg.weather) {
        document.querySelector("#weather").hidden = true
        return 0
    }

    fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cfg.weatherCity}&appid=${cfg.weatherAPIkey}&lang=${cfg.weatherLang}&units=${cfg.weatherUnits}`
    )
        .then((x) => x.json())
        .then((data) => {
            let icon = document.querySelector(`#weather_icon`)

            icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`

            document.querySelector(`#temperature`).innerText =
                Math.round(data.main.temp) + "°"

            document.querySelector(`#weather_desc`).innerText =
                data.weather[0].description
        })
}
