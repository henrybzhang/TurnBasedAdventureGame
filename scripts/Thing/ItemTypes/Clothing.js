import Item from "../Item.js";

export default class Clothing extends Item {
    constructor(name, desc, rarity, type, subType, value, resistance) {
        super(name, desc, rarity, type, subType, value);
        this.resistance = resistance;
    }
}
