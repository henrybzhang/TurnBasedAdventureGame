export let placeList = {};
export let tileList = {};

export let itemList = {};

export let monsterList = {
    "randomMonster" : function() {
        let keys = Object.keys(this);
        let index = keys.indexOf("randomMonster");
        keys.splice(index, 1);

        return this[keys[Math.floor(Math.random() * keys.length)]];
    }
};
export let npcList = {};

export let questList = {};

export let totalList = {};

export let me;
export function createMe(player) {
    console.log("Creating me");
    me = player;
    console.log(me);
    console.log("\n");
    return me;
}
