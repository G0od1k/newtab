function clearChildren(el) {
    Object.values(el.children).forEach((e) => {
        el.removeChild(e)
    })
}

function loadTabs() {
    const tabsListNode = document.querySelector(`#tabs`)
    clearChildren(tabsListNode)

    function newTabButton(path) {
        const button = document.createElement(`button`)
        button.innerText = `+`
        button.className = `newTab`

        button.onclick = function () {
            path.sub ??= []
            path.sub.push({
                name: "",
            })
            loadTabs()
            draw()
        }

        return button
    }

    function removeTabButton(path, i, root) {
        const button = document.createElement(`button`)
        button.innerText = `✕`
        button.className = `removeTab`

        button.onclick = function () {
            path.sub.splice(i, 1)
            if (!path.sub.length && !root) delete path.sub
            loadTabs()
            draw()
        }

        return button
    }

    function rendTab(tabData, root = false, parent, i) {
        const tab = document
                .querySelector("template#tab")
                .content.firstElementChild.cloneNode(true),
            newTab = newTabButton(tabData, root)

        ;["name", "url", "before", "after", "sliceStart", "sliceEnd"].forEach(
            (x) => {
                const target = tab.querySelector(`.tab_` + x)
                target.value = tabData[x] ?? ``

                target.oninput = () => {
                    tabData[x] =
                        target.type == `number`
                            ? target.valueAsNumber
                            : target.value
                    draw()
                }
            }
        )

        if (root) {
            tab.removeChild(tab.querySelector(`.tab_slice`))
            tab.removeChild(tab.querySelector(`.tab_before`))
            tab.removeChild(tab.querySelector(`.tab_after`))
        } else {
            tab.removeChild(tab.querySelector(`.tab_url`))
        }

        tab.querySelector(`.tab_sub`).appendChild(newTab)
        tab.querySelector(`.tab_name`).before(removeTabButton(parent, i, root))

        tabData.sub?.forEach((subTab, i) => {
            newTab.before(rendTab(subTab, false, tabData, i))
        })

        return tab
    }

    tabs.sub.forEach((tab, i) => {
        tabsListNode.appendChild(rendTab(tab, true, tabs, i))
    })
    tabsListNode.appendChild(newTabButton(tabs))
}

document.querySelector(`#settingsButtonOpen`).onclick = function () {
    loadTabs()
}

document.querySelector(`#discardSetting`).onclick = function () {
    tabs = JSON.parse(localStorage.tabs ?? `null`)
    draw()
}

document.querySelector(`#applySetting`).onclick = function () {
    localStorage.setItem(`tabs`, JSON.stringify(tabs))
}
