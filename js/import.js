document.querySelector(`#import`).onchange = function () {
    const fr = new FileReader()

    fr.onload = function () {
        const data = JSON.parse(fr.result)
        tabs = data
        draw()
    }

    fr.readAsText(this.files[0])
    this.value = null
}
