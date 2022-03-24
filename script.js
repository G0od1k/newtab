let data = [
    {
        name: `YouTube`,
        url: `https://youtube.com`,
        sub: [
            {
                type: `after`,
                url: `/feed/subscriptions`,
                name: `Subs`,
            },
            {
                type: `after`,
                url: `/feed/library`,
                name: `Library`,
            },
            {
                type: `after`,
                url: `/playlist?list=WL`,
                name: `Watch Later`,
            },
            {
                type: `after`,
                url: `/playlist?list=LL`,
                name: `Liked`,
            },
        ],
    },
    {
        name: `Twitch`,
        url: `https://twitch.tv`,
    },
    {
        name: `GitHub`,
        url: `https://github.com`,
    },
    {
        name: `StackOverflow`,
        url: `https://stackoverflow.com`,
    },
    {
        name: `Wikipedia`,
        url: `https://ru.wikipedia.org`,
        sub: [
            {
                type: `before`,
                url: `https://en`,
                name: `EN`,
                slice: [10],
            },
        ],
    },
    {
        name: `Keep`,
        url: `https://keep.google.com`,
    },
    {
        name: `Rezka.ag`,
        url: `https://rezka.ag`,
    },
    {
        name: `Twitter`,
        url: `https://twitter.com`,
    },
    {
        name: `Reddit`,
        url: `https://reddit.com`,
    },
    {
        name: `VS Code Store`,
        url: `https://marketplace.visualstudio.com/vscode`,
    },
    {
        name: `localhost`,
        url: `http://localhost`,
        sub: [
            {
                type: `after`,
                url: `:3000`,
                name: `3000`,
            },
            {
                type: `after`,
                url: `:5500`,
                name: `5500`,
            },
        ],
    },
    {
        name: `textarea`,
        url: `data:text/html,<textarea></textarea>`,
    },
    {
        name: `Pixilart`,
        url: `https://pixilart.com/draw`,
    },
    {
        name: `Translate`,
        url: `https://translate.google.com`,
    },
    {
        name: `SteamDB`,
        url: `https://steamdb.info`,
    },
    {
        name: `Epic Games Store`,
        url: `https://epicgames.com/store/ru`,
    },
    {
        name: `Regex 101`,
        url: `https://regex101.com/`,
    },
]
let path = []
let keyMap = []
let cfg = {
    bg: {
        type: "color",
        s: 20,
        l: 20,
    },
}

Object.prototype.toPath = function (path) {
    if (path.length == 0) {
        return this
    }
    return this[path[0]].sub.toPath(path.slice(1))
}

function drawDir(dir, path, p) {
    data.toPath(path).forEach((h, i) => {
        let a = document.createElement(`a`)
        let icon = document.createElement(`img`)
        let name = document.createElement(`span`)

        a.className = `a`
        icon.className = `a_icon`
        name.className = `a_name`
        a.id = `I` + path.concat(i).join(`_`)

        for (let j of h.name.toLowerCase().split(``)) {
            if (
                keyMap
                    .toPath(path)
                    .map((x) => x.key)
                    .indexOf(j) == -1 &&
                ` ~!@#$%^&*()_+`.indexOf(j)
            ) {
                keyMap.toPath(path).push({ sub: [], key: j })
                break
            }
        }

        let glowLetterIndex = h.name
            .toLowerCase()
            .indexOf(keyMap.toPath(path)[i].key)
        let glowLetter = h.name[glowLetterIndex]

        lp = p || h

        a.href =
            (h.type == `before` ? h.url : "") +
            lp.url.slice(h.slice?.[0], h.slice?.[1]) +
            (h.type == `after` ? h.url : "")
        name.innerHTML =
            h.name.slice(0, glowLetterIndex) +
            `<u>${glowLetter}</u>` +
            h.name.slice(glowLetterIndex + 1)
        icon.src = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${a.href}&size=32`

        a.appendChild(icon)
        a.appendChild(name)
        dir.appendChild(a)

        if (h.sub) {
            let div = document.createElement(`div`)
            div.id = `I` + path.concat(i).join(`_`) + `sub`
            drawDir(div, path.concat(i), h)
            div.className = `sub`
            a.appendChild(div)
            a.className = `a c`
        }
    })
}

window.onkeydown = (e) => {
    let code = e.code.replace(/(Digit)|(Key)(\w)/, "$3").toLowerCase()
    let i = keyMap
        .toPath(path)
        .map((x) => x.key)
        .indexOf(code)
    console.log(e)

    if (i == -1 && e.code != `Escape`) return false

    if (e.code == `Escape`) {
        document.querySelector(`#I` + path.join(`_`)).removeAttribute(`h`)

        path.pop()
    } else if (e.altKey) {
        document
            .querySelector(`#I` + path.concat(i).join(`_`))
            .setAttribute(`h`, true)

        path.push(i)
    } else {
        document.querySelector(`#I` + path.concat(i).join(`_`)).click()
    }

    // return false
}

Object.values(document.querySelectorAll(`#href>a`)).forEach((x, i) => {
    let c = Object.values(document.querySelectorAll(`#href>a`)).length
    x.style.position = `absolute`
    x.style.bottom =
        window.innerHeight / 2 +
        (Math.cos(((Math.PI * 2) / c) * i) * window.innerHeight) / 3 +
        "px"
    x.style.left =
        window.innerWidth / 2 +
        (Math.sin(((Math.PI * 2) / c) * i) * window.innerHeight) / 3 +
        "px"
    x.style.transform = `translate(-50%, 50%)`
})

drawDir(document.querySelector(`#href`), [])
