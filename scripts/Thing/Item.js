"use strict";

import Thing from "./Thing.js";

export const itemTypeEnum = Object.freeze({
    "MISC": 1,
    "TOOL": 2,
    "CLOTHING": 3,
    "CONSUMABLE": 4
});

export const MONEY_TYPE_LIST = ["copper", "silver", "gold"];
export const CONVERSION_RATE = [1, 16, 128];
export const MONEY_TYPES = MONEY_TYPE_LIST.length;

export default class Item extends Thing {
    constructor(name, desc, rarity, type, value) {
        super(name, desc);
        this.rarity = rarity;
        this.type = type;
        this.value = value;
    }

    getValue() {
        return Item.totalValue(this.value);
    }

    /**
     * @param amount {int[]} [copper, silver, gold]
     * @returns {int} Total Value in lowest form of currency
     */
    static totalValue(amount) {
        let totalValue = 0;
        for(let i = 0; i < MONEY_TYPES; i++) {
            totalValue += amount[i] * CONVERSION_RATE[i];
        }
        return totalValue;
    }
}