window.onkeydown = (e) => {
    if (document.querySelector(`#settingsCheck`).checked || !cfg.hotkeys)
        return 0

    let code = e.code.replace(/(?:Digit)|(?:Key)(\w)/, "$1").toLowerCase()
    let i = toSubPath(keyMap, path)
            .map((x) => x.key)
            .indexOf(code),
        targetTab = toSubPath(tabs, path)[i]

    if (
        (i == -1 && e.code != `Escape`) ||
        (e.ctrlKey && e.shiftKey && e.code == `KeyI`)
    )
        return 0

    if (e.code == `Escape`) {
        document.querySelector(`#I` + path.join(`_`)).removeAttribute(`h`)

        path.pop()
    } else if (
        (e.altKey || targetTab.dir) &&
        toSubPath(keyMap, path.concat(i)).length
    ) {
        document
            .querySelector(`#I` + path.concat(i).join(`_`))
            .setAttribute(`h`, true)

        path.push(i)
    } else {
        document.querySelector(`#I${path.concat(i).join(`_`)} > a`).click()
    }

    // return false
}
