const API_KEY = "KEY"

fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Praha&appid=${API_KEY}&lang=uk&units=metric`
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
