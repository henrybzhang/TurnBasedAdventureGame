"use strict";

import Thing from "./Thing.js";

export const itemTypeEnum = Object.freeze({
    "MISC": 1,
    "TOOL": 2,
    "CLOTHING": 3,
    "CONSUMABLE": 4
});

export default class Item extends Thing {
    constructor(name, desc, rarity, type, value) {
        super(name, desc);
        this.rarity = rarity;
        this.type = type;
        this.value = value;
    }
}