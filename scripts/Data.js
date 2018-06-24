export let placeList = {};
export let tileList = {};

export let itemList = {};
export let monsterList = {
    randomMonster: function() {
        let keys = Object.keys(this);
        let index = keys.indexOf("randomMonster");
        keys.splice(index, 1);

        return this[keys[Math.floor(Math.random() * keys.length)]];
    }
};