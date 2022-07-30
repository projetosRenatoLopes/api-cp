const checkProps = (objeto) => {
    if (objeto.hasOwnProperty("empname") &&
        objeto.hasOwnProperty("emptag") &&
        objeto.hasOwnProperty("empfuncdom") &&
        objeto.hasOwnProperty("empfuncseg") &&
        objeto.hasOwnProperty("empfuncter") &&
        objeto.hasOwnProperty("empfuncqua") &&
        objeto.hasOwnProperty("empfuncqui") &&
        objeto.hasOwnProperty("empfuncsex") &&
        objeto.hasOwnProperty("empfuncsab") &&
        objeto.hasOwnProperty("empadrrua") &&
        objeto.hasOwnProperty("empadrnum") &&
        objeto.hasOwnProperty("empadrcom") &&
        objeto.hasOwnProperty("empadrbai") &&
        objeto.hasOwnProperty("empadrcid") &&
        objeto.hasOwnProperty("empadrest") &&
        objeto.hasOwnProperty("emptxentrega") &&
        objeto.hasOwnProperty("emplogo") &&
        objeto.hasOwnProperty("emptel") &&
        objeto.hasOwnProperty("empcategs") &&
        objeto.hasOwnProperty("emppaymodes") === true) {
        return true
    } else {
        return false
    }
}

exports.checkProps = checkProps;