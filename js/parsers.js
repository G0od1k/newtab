function symbolKeyMapParser(txt = "") {
    return txt.split("\n").map((x) => x.split(/\s?-\s?/))
}
