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

/**
 *
 * @param name {String} The name of the object to be found
 * @param obj {Object} Holds many keys ex: placeList, tileList, npcList
 * @returns {Thing} The object
 */
export function findObj(name, obj) {
    for(let id in obj) {
        if(obj[id].name === name) {
            return obj[id];
        }
    }
    console.log('------------------------------------------------------------');
    console.error("Could not find " + name + " in:");
    console.error(obj);
    console.log('------------------------------------------------------------');
    return null;
}

export function chooseRandom(obj) {
    let keys = Object.keys(obj);
    let index = Math.floor(Math.random() * keys.length);

    return obj[keys[index]];
}
