import {itemList} from '../Data.js';
import Item, {MONEY_TYPE_LIST, CONVERSION_RATE, MONEY_TYPES} from "./Item.js";
import Mobile from './Mobile.js';

"use strict";

const ERROR_NOT_ENOUGH_ENERGY = "Not enough energy";
const ERROR_UNKNOWN_ACTION = "Unknown action: {0}";

const STAT_NAMES = ["hp", "energy", "agility", "strength"];
const TOTAL_STAT_COUNT = STAT_NAMES.length;

const INFO = "Level: {0}\nHP: {1}\nEnergy: {2}\nAgility: {3}\nStrength: {4}";

const BASE_MULTIPLIER = 10;

export default class Entity extends Mobile {

    /**
     * @param name
     * @param desc
     * @param parentPlaceName
     * @param xPos
     * @param yPos
     * @param level {int} Level of this
     * @param baseStats {int[]} Array of stats
     * @param inventory {String[]} List of itemNames
     */
    constructor(name, desc, parentPlaceName, xPos, yPos, level, baseStats, inventory) {
        super(name, desc, parentPlaceName, xPos, yPos);

        this.level = level;

        this.baseStats = {};
        for(let i = 0; i < TOTAL_STAT_COUNT; i++) {
            this.baseStats[STAT_NAMES[i]] = baseStats[i];
        }

        this.inventory = [];
        for(let itemName of inventory) {
            let item = itemList[itemName];
            if(item === null) {
                console.error("{0} not found in itemList".format(itemName));
            }

            this.inventory.push(itemList[itemName]);
        }
        this.money = [0, 0, 0];

        this.tempModifier = 1;

        this.currentStats = JSON.parse(JSON.stringify(this.baseStats));
    }

    loseItem(itemName) {
        let index = this.inventory.indexOf(itemList[itemName]);
        if(index === -1) {
            console.error("{0} does not have a {1}".format(this.name, itemName));
            return;
        }
        this.inventory.splice(index, 1);
    }

    gainItem(itemName) {
        this.inventory.push(itemList[itemName]);
    }

    loot(entity) {
        while(entity.inventory.length !== 0) {
            this.inventory.push(entity.inventory.pop());
        }
    }

    getInventory() {
        let inventoryItemNames = [];
        for(let item of this.inventory) {
            inventoryItemNames.push(item.name);
        }
        return inventoryItemNames;
    }

    gainMoney(amount) {
        for(let i = 0; i < MONEY_TYPES; i++) {
            this.money[i] += amount[i];
        }
    }

    /**
     * TODO: Assumes perfect change, consider implementing imperfect change
     * @param amount
     * @returns {boolean} true if Entity has enough money to lose, false otherwise
     */
    loseMoney(amount) {
        let remainder = Item.totalValue(this.money) - Item.totalValue(amount);

        if(remainder < 0) return false;

        for(let i = MONEY_TYPES - 1; i >= 0; i--) {
            this.money[i] = remainder / CONVERSION_RATE[i];
            remainder -= this.money[i] * CONVERSION_RATE[i];
        }
        return true;
    }

    loseHP(amount) {
        this.currentStats["hp"] -= amount;
        if(this.currentStats.hp < 0){
            this.currentStats.hp = 0;
        }
    }

    loseEnergy(amount) {
        this.currentStats.energy = this.currentStats.energy - amount;
        if(this.currentStats.energy < 0){
            this.currentStats.energy = 0;
            console.error(ERROR_NOT_ENOUGH_ENERGY);
        }
    }

    energyCost(action) {
        switch(action) {
            case "Attack":
                return 1;
            case "Defend":
                return 1;
            case "Run":
                return 3;
            case "Move":
                return 1;
            default:
                console.error(ERROR_UNKNOWN_ACTION.format(action));
                return 0;
        }
    }

    baseStatsArray() {
        let statsArray = [];
        for(let i = 0; i < TOTAL_STAT_COUNT; i++) {
            statsArray.push(this.baseStats[STAT_NAMES[i]]);
        }
        return statsArray;
    }

    fatigue() {
        return this.currentStats.energy / this.baseStats.energy;
    }

    hp() {
        return this.currentStats["hp"];
    }

    energy() {
        return this.currentStats["energy"];
    }

    agility() {
        return this.currentStats["agility"];
    }

    strength() {
        return this.currentStats["strength"];
    }

    statInfo() {
        return INFO.format(this.level, this.hp(), this.energy(), this.agility(),
                            this.strength());
    }

    info() {
        return this.name + "\n" + this.statInfo();
    }

    clone() {
       return new Entity(this.name, this.desc, this.parentPlace, this.xPos,
           this.yPos, this.level, this.baseStatsArray(), this.inventory);
    }
}
