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

// without overwrite
export function deepAssign(target, obj) {
    for (const key of Object.getOwnPropertyNames(obj)) {
        if(target[key] != null) continue;
        target[key] = obj[key];
    }
}

export function chooseRandom(list) {
    let keys = Object.keys(list);
    let index = Math.floor(Math.random() * keys.length);

    return list[keys[index]];
}