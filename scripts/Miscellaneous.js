String.prototype.format = function() {
    let a = this;
    for (let k in arguments) {
        a = a.replace("{" + k + "}", arguments[k]);
    }
    return a;
};

// synchronous reading to make sure everything is initialized before moving on
export function readFile(filePath) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", filePath, false);
    xhr.send();

    return xhr.responseText;
}
