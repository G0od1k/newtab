const URIVarsRegExp = /(?<!\\){\?[^{}:]+(?::[^{}]+)?}/

async function URIVars(uri = "") {
    while (hasURIVariables(uri)) {
        await new Promise((res, rej) => {
            setTimeout(res, 300)
        })
        uri = uri.replace(
            URIVarsRegExp,
            await dialog(...uri.match(URIVarsRegExp)[0].slice(2, -1).split(":"))
        )
    }
    return uri
}

function hasURIVariables(uri = "") {
    return URIVarsRegExp.test(uri)
}
