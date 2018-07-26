import Item from "../Item.js";
import {STAT_NAMES} from "../Plottables/Entity.js";

export default class Tool extends Item {
    constructor(name, desc, rarity, type, subType, value, stats) {
        super(name, desc, rarity, type, subType, value);

        this.stats = {};
        for (let i = 0; i < stats.length; i++) {
            this.stats[STAT_NAMES[i]] = stats[i];
        }
    }

}