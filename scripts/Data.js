export let placeList = {};
export let tileList = {};

export let itemList = {};

export let monsterList = {};
export let activeMonsters = {};

export let npcList = {};

export let questList = {};

export let totalList = {};

// the player
export let me;
export function createMe(player) {
    console.log("Creating me");
    me = player;
    console.log(me);
    return me;
}
