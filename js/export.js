document.querySelector(`#export`).onclick = function () {
    const a = document.createElement("a")
    a.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," +
            encodeURIComponent(JSON.stringify(tabs, null, 4))
    )
    a.setAttribute("download", "backup.json")

    a.style.display = "none"
    document.body.appendChild(a)

    a.click()

    document.body.removeChild(a)
}
