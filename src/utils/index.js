exports.isEmpty = (item) => {
    if (item === "" || item === null || item === "null" || item === undefined || item === "undefined") {
        return (true)
    } else {
        return (false)
    }
}

exports.isZeroOrLess = (item) => {
    if (item === 0 || item === "0" || item < 0 || item < "0" ) {
        return (true)
    } else {
        return (false)
    }
}