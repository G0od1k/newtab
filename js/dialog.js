async function dialog(name = "Name", value = "") {
    const dialogEl = document.querySelector(`dialog`),
        input = dialogEl.querySelector(`input`),
        h1 = dialogEl.querySelector(`h1`)

    h1.innerText = name
    input.value = value

    dialogEl.show()

    input.select()

    return new Promise((res, rej) => {
        dialogEl.querySelector(`[type="submit"]`).onclick = () => {
            res(dialogEl.querySelector(`input`).value)
        }
    })
}
