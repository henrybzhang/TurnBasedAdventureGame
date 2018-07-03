import Item from "../Item.js";

export default class Consumable extends Item {
    constructor(name, desc, rarity, type, value, power, beneficial) {
        super(name, desc, rarity, type, value);
        this.power = power;
        this.beneficial = beneficial;
    }
}
