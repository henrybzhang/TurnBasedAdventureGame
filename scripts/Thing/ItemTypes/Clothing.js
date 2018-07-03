import Item from "../Item.js";

export default class Clothing extends Item {
    constructor(name, desc, rarity, type, value, resistance) {
        super(name, desc, rarity, type, value);
        this.resistance = resistance;
    }
}
