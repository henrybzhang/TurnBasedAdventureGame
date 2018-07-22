import Item from "../Item.js";

export default class Tool extends Item {
    constructor(name, desc, rarity, type, subType, value, strength) {
        super(name, desc, rarity, type, subType, value);
        this.strength = strength;
    }

}