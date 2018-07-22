import Item from "../Item.js";

export default class Misc extends Item {
    /**
     * @param name
     * @param desc
     * @param rarity
     * @param type
     * @param subType
     * @param value
     * @param hidden {boolean} Whether this item is shown during trades
     */
    constructor(name, desc, rarity, type, subType, value, hidden) {
        super(name, desc, rarity, type, subType, value);
        this.hidden = hidden;
    }
}