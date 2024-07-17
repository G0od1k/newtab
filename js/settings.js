function clearChildren(el) {
    Object.values(el.children).forEach((e) => {
        el.removeChild(e)
    })
}

function loadCfg() {
    const tabsListNode = document.querySelector(`#tabs`)
    clearChildren(tabsListNode)

    function newTabButton(path) {
        const button = document.createElement(`button`)
        button.className = `newTab`

        button.onclick = function () {
            path.sub ??= []
            path.sub.push({
                name: "",
            })
            loadCfg()
            draw()
        }

        return button
    }

    function removeTabButton(path, i, root) {
        const button = document.createElement(`button`)
        button.className = `removeTab`

        button.onclick = function () {
            path.sub.splice(i, 1)
            if (!path.sub.length && !root) delete path.sub
            loadCfg()
            draw()
        }

        return button
    }

    function swapTabUpButton(path, i) {
        const button = document.createElement(`button`)
        button.className = `swapTabsUp`

        button.onclick = function () {
            ;[path.sub[i], path.sub[i - 1]] = [path.sub[i - 1], path.sub[i]]
            loadCfg()
            draw()
        }

        return button
    }

    function swapTabDownButton(path, i) {
        const button = document.createElement(`button`)
        button.className = `swapTabsDown`

        button.onclick = function () {
            ;[path.sub[i], path.sub[i + 1]] = [path.sub[i + 1], path.sub[i]]
            loadCfg()
            draw()
        }

        return button
    }

    function rendTab(tabData, root = false, parent, i) {
        const tab = document
                .querySelector("template#tab")
                .content.firstElementChild.cloneNode(true),
            newTab = newTabButton(tabData, root)

        ;[
            "name",
            "url",
            "key",
            "dir",
            "before",
            "after",
            "sliceStart",
            "sliceEnd",
        ].forEach((x) => {
            const target = tab.querySelector(`.tab_` + x)
            target[target.type == `checkbox` ? "checked" : "value"] =
                tabData[x] ?? ``

            target.oninput = () => {
                let value =
                    target[
                        {
                            number: "valueAsNumber",
                            checkbox: "checked",
                            text: "value",
                        }[target.type]
                    ]
                tabData[x] = value === 0 ? 0 : value || undefined
                draw()
            }
        })

        if (root) {
            tab.removeChild(tab.querySelector(`.tab_slice`))
            tab.removeChild(tab.querySelector(`.tab_before`))
            tab.removeChild(tab.querySelector(`.tab_after`))
        } else {
            tab.removeChild(tab.querySelector(`.tab_url`))
        }

        if (tabData.sub) {
            //? For future update
        } else {
            tab.removeChild(tab.querySelector(`label:has(.tab_dir)`))
        }

        tab.querySelector(`.tab_sub`).appendChild(newTab)
        if (i) {
            tab.querySelector(`.upButtons`).appendChild(
                swapTabUpButton(parent, i)
            )
        }
        if (i != parent.sub.length - 1) {
            tab.querySelector(`.upButtons`).appendChild(
                swapTabDownButton(parent, i)
            )
        }
        tab.querySelector(`.upButtons`).appendChild(
            removeTabButton(parent, i, root)
        )

        tabData.sub?.forEach((subTab, i) => {
            newTab.before(rendTab(subTab, false, tabData, i))
        })

        return tab
    }

    tabs.sub.forEach((tab, i) => {
        tabsListNode.appendChild(rendTab(tab, true, tabs, i))
    })
    tabsListNode.appendChild(newTabButton(tabs))
    ;[
        "keys",
        "hotkeys",
        "symbolKeyMapping",
        "bgType",
        "bgSaturate",
        "bgLight",
        "bgGradColCount",
        "bgURIs",
        "bgUpdTime",
        "icon",
        "tabsRenderDelay",
        "URIVars",
        "clock",
        "clockType",
        "clockSec",
        "clock12h",
        "clockUpdTime",
        "clockNums",
        "weather",
        "weatherAPIkey",
        "weatherCity",
        "weatherLang",
        "weatherUnits",
    ].forEach((x, i) => {
        let input = document.querySelector(`#cfg-${x}`)

        input[typeof cfg[x] == `boolean` ? "checked" : "value"] = cfg[x]

        input.oninput = () => {
            cfg[x] =
                input[
                    {
                        number: "valueAsNumber",
                        checkbox: "checked",
                        text: "value",
                        "select-one": "value",
                        textarea: "value",
                        password: "value",
                    }[input.type]
                ]

            draw()
        }
    })
}

function clearCfg() {
    setTimeout(() => {
        clearChildren(document.querySelector(`#tabs`))
    }, 300)
}

document.querySelector(`#settingsButtonOpen`).onclick = function () {
    loadCfg()
}

document.querySelector(`#discardSetting`).onclick = function () {
    tabs = JSON.parse(localStorage.tabs ?? `null`)
    draw()
    clearCfg()
}

document.querySelector(`#applySetting`).onclick = function () {
    localStorage.setItem(`tabs`, JSON.stringify(tabs))
    clearCfg()
}
