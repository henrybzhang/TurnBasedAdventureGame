String.prototype.format = function() {
    let newString = this;
    for (let k in arguments) {
        newString = newString.split("{" + k + "}").join(arguments[k]);
    }
    return newString;
};

// synchronous reading to make sure everything is initialized before moving on
export function readFile(filePath) {
    console.log("Opening |{0}| to read.".format(filePath));

    let xhr = new XMLHttpRequest();
    xhr.open("GET", filePath, false);
    xhr.send();

    return xhr.responseText;
}
