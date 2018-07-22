import Item from "../Item.js";

export default class Consumable extends Item {
    constructor(name, desc, rarity, type, subType, value, power, beneficial) {
        super(name, desc, rarity, type, subType, value);
        this.power = power;
        this.beneficial = beneficial;
    }
}
