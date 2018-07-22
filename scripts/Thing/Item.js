"use strict";

import Thing from "../Game/Thing.js";

export const itemTypeEnum = Object.freeze({
    "MISC": 1,
    "TOOL": 2,
    "CLOTHING": 3,
    "CONSUMABLE": 4
});

export const MONEY_TYPES = ["Copper", "Silver", "Gold"];
export const CONVERSION_RATE = [1, 16, 128];
export const MONEY_TYPE_LENGTH = MONEY_TYPES.length;

export default class Item extends Thing {

    /**
     * @param name
     * @param desc
     * @param rarity
     * @param type
     * @param subtype
     * @param value
     */
    constructor(name, desc, rarity, type, subtype, value) {
        super(name, desc);
        this.rarity = rarity;
        this.type = type;
        this.subType = subtype;
        this.value = value;
    }

    getValue() {
        return this.value;
    }

    /**
     * @param amount {int[]} [copper, silver, gold]
     * @returns {int} Total Value in lowest form of currency
     */
    static totalValue(amount) {
        let totalValue = 0;
        for(let i = 0; i < MONEY_TYPE_LENGTH; i++) {
            totalValue += amount[i] * CONVERSION_RATE[i];
        }
        return totalValue;
    }
}