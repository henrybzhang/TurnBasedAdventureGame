import {Plottable} from "../Plottable.js";

const MONEY_TYPES = 3;

export class Entity extends Plottable {

    constructor(name, desc, place, xPos, yPos, level, baseStats, inventory) {
        super(name, desc, place, xPos, yPos);

        this.level = level;
        this.baseStats = baseStats;
        this.inventory = inventory;

        this.money = new Array(MONEY_TYPES);
        this.tempModifier = 1;

        this.currentStats = this.baseStats.slice();
    }
}