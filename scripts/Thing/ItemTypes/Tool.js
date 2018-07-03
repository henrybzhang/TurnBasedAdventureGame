import Item from "../Item.js";

export default class Tool extends Item {
    constructor(name, desc, rarity, type, value, strength) {
        super(name, desc, rarity, type, value);
        this.strength = strength;
    }

}