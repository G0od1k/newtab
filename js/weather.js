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

            const icons = {
                "01d": "sun",
                "01n": "moon",
                "02d": "cloud-with-sun",
                "02n": "cloud-with-moon",
                "03d": "cloud",
                "03n": "cloud",
                "04d": "clouds",
                "04n": "clouds",
                "09d": "rainy-clouds",
                "09n": "rainy-clouds",
                "10d": "rainy-cloud-with-sun",
                "10n": "rainy-cloud-with-moon",
                "11d": "lightning-bolt-clouds",
                "11n": "lightning-bolt-clouds",
                "13d": "snowflakes",
                "13n": "snowflakes",
                "50d": "mist",
                "50n": "mist",
            }

            icon.src = `./svg/weather/${icons[data.weather[0].icon]}.svg`

            document.querySelector(`#temperature`).innerText =
                Math.round(data.main.temp) + "°"

            document.querySelector(`#weather_desc`).innerText =
                data.weather[0].description
        })
}
