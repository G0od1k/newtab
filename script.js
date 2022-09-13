let tabs = JSON.parse(localStorage.tabs ?? `null`) ?? {
    sub: [
        {
            name: `Example`,
            url: `https://example.com`,
        },
        {
            name: `Link with sub links`,
            url: `https://github.com`,
            sub: [
                {
                    name: `Sub link`,
                    after: `/G0od1k`,
                },
            ],
        },
        {
            name: `Link with modifiers`,
            url: `https://en.wikipedia.org`,
            sub: [
                {
                    name: `After`,
                    after: `/Gold`,
                },
                {
                    name: `Before and Slice`,
                    sliceStart: 10,
                    before: `https://uk`,
                },
                {
                    name: `After and Before`,
                    sliceStart: 10,
                    before: `https://uk`,
                    after: `/wiki/Золото`,
                    sub: [
                        {
                            name: `After and Slice`,
                            sliceEnd: -6,
                            after: `JavaScript`,
                        },
                    ],
                },
            ],
        },
    ],
}
let cfg = {
    bg: {
        type: "color",
        s: 20,
        l: 20,
    },
    key: {
        hot: true,
        sym: "0123456789abcdefghijklmnopqrstuvwxyz",
    },
    icon: false,
}
let keyMap
let path = []

function toSubPath(obj, path) {
    if (path.length == 0) {
        return obj.sub
    }
    return toSubPath(obj.sub[path[0]], path.slice(1))
}

function drawDir(dir, path = [], p = ``, keyMap = { sub: [] }) {
    toSubPath(tabs, path).forEach((h, i) => {
        let a = document.createElement(`a`),
            icon = document.createElement(`img`),
            name = document.createElement(`span`)
        u = document.createElement(`u`)

        a.className = `a`
        icon.className = `a_icon`
        name.className = `a_name`
        a.id = `I` + path.concat(i).join(`_`)

        for (let j of h.name.toLowerCase().split(``)) {
            if (
                toSubPath(keyMap, path)
                    .map((x) => x.key)
                    .indexOf(j) == -1 &&
                cfg.key.sym.includes(j)
            ) {
                toSubPath(keyMap, path)[i] = { sub: [], key: j }
                break
            }
        }

        let hotLetterIndex = h.name
            .toLowerCase()
            .indexOf(toSubPath(keyMap, path)[i]?.key)
        u.innerText = h.name[hotLetterIndex]

        lp = p || h.url

        a.href = next =
            (h.before ?? "") +
            lp.slice(h.sliceStart, h.sliceEnd) +
            (h.after ?? "")

        name.append(h.name.slice(0, hotLetterIndex))
        name.appendChild(u)
        name.append(h.name.slice(hotLetterIndex + 1))

        if (cfg.icon) {
            icon.src = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${a.href}&size=32`
            a.appendChild(icon)
        }
        a.appendChild(name)
        dir.appendChild(a)

        if (h.sub) {
            let div = document.createElement(`div`)
            div.id = `I` + path.concat(i).join(`_`) + `sub`
            drawDir(div, path.concat(i), next, keyMap)
            div.className = `sub`
            a.appendChild(div)
            a.className = `a c`
        }
    })
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

function draw() {
    keyMap = { sub: [] }
    clearChildren(document.querySelector(`#href`))
    drawDir(document.querySelector(`#href`), [], ``, keyMap)
}

draw()
