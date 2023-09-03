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
let cfg, keyMap
let path = []

function toSubPath(obj, path) {
    if (path.length == 0) {
        return obj.sub
    }
    return toSubPath(obj.sub[path[0]], path.slice(1))
}

function drawDir(dir, path = [], p = ``, keyMap = { sub: [] }) {
    toSubPath(tabs, path).forEach((h, i) => {
        if (h.key) {
            toSubPath(keyMap, path)[i] = { sub: [], key: h.key }
        }
    })
    toSubPath(tabs, path).forEach((h, i) => {
        let name = document.createElement(`a`),
            icon = document.createElement(`img`),
            span = document.createElement(`span`),
            u = document.createElement(`u`)

        span.className = `a`
        if (h.dir) span.classList.add(`dir`)
        icon.className = `a_icon`
        name.className = `a_name`
        span.id = `I` + path.concat(i).join(`_`)

        function transliterate(txt) {
            return txt.toLowerCase().replace(/./g, (x) => {
                return (
                    symbolKeyMapParser(cfg.symbolKeyMapping).filter(
                        (y) => y[0] == x
                    )[0]?.[1] ?? x
                )
            })
        }

        if (!h.key) {
            for (let j of transliterate(h.name).split(``)) {
                if (
                    toSubPath(keyMap, path)
                        .map((x) => x.key)
                        .indexOf(j) == -1 &&
                    cfg.keys.includes(j)
                ) {
                    toSubPath(keyMap, path)[i] = {
                        sub: [],
                        key: j,
                    }
                    break
                }
            }
        }

        const hotLetterIndex = transliterate(h.name).indexOf(
            toSubPath(keyMap, path)[i]?.key
        )

        u.innerText = h.name[hotLetterIndex]

        let lp = p || h.url,
            next

        const href =
            (name.href =
            next =
                (h.before ?? "") +
                lp.slice(h.sliceStart, h.sliceEnd) +
                (h.after ?? ""))

        name.onclick = async (e) => {
            e.preventDefault()
            window.location.href = cfg.URIVars ? await URIVars(href) : href
        }

        if (hotLetterIndex != -1) {
            name.append(h.name.slice(0, hotLetterIndex))
            name.appendChild(u)
        }
        name.append(h.name.slice(hotLetterIndex + 1))

        if (cfg.icon) {
            icon.src = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${name.href}&size=32`
            span.appendChild(icon)
        }
        span.appendChild(name)

        if (!cfg.tabsRenderDelay) {
            dir.appendChild(span)
        } else {
            setTimeout(() => {
                dir.appendChild(span)
            }, cfg.tabsRenderDelay * i)
        }

        if (h.sub) {
            let div = document.createElement(`div`)
            div.id = `I` + path.concat(i).join(`_`) + `sub`
            drawDir(div, path.concat(i), next, keyMap)
            div.className = `sub`
            span.appendChild(div)
        }
    })
}

function draw() {
    keyMap = { sub: [] }
    cfg =
        tabs.cfg ??
        (tabs.cfg = {
            bgType: "color",
            bgSaturate: 20,
            bgLight: 20,
            bgGradColCount: 2,
            bgURIs: ``,
            bgUpdTime: 2000,

            hotkeys: true,
            keys: "0123456789abcdefghijklmnopqrstuvwxyz`-=[]\\;',./",
            symbolKeyMapping:
                "~ - `\n_ - -\n+ - =\n{ - [\n} - ]\n| - \\\n: - ;\n\" - '\n< - ,\n> - .\n? - /",

            icon: false,
            tabsRenderDelay: 0,
            URIVars: false,

            clock: true,
            clockType: "num",
            clockSec: true,
            clock24h: true,
            clockUpdTime: 1000,
            clockNums: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12",
        })
    clearChildren(document.querySelector(`#href`))
    drawDir(document.querySelector(`#href`), [], ``, keyMap)
    loops()
}

draw()

// document.querySelector(`#settingsButtonOpen`).click()
