import {itemList} from '../Data.js';
import Item, {MONEY_TYPE_LIST, CONVERSION_RATE, MONEY_TYPES} from "./Item.js";
import Mobile from './Mobile.js';

"use strict";

const ERROR_NOT_ENOUGH_ENERGY = "Not enough energy";
const ERROR_UNKNOWN_ACTION = "Unknown action: {0}";

const GAIN_XP_TEXT = "{0} gained {1} XP for a total of {2} XP";
const LEVEL_UP_TEXT = "{0} leveled up to {1}";

const STAT_NAMES = ["hp", "energy", "agility", "strength"];
const HP_INDEX = 0;
const ENERGY_INDEX = 1;
const AGILITY_INDEX = 2;
const STRENGTH_INDEX = 3;
const TOTAL_STAT_COUNT = STAT_NAMES.length;

const REST_ENERGY_GAIN = 5;
const REST_HP_GAIN = 5;

const BASE_XP_LEVEL = 10;
const XP_NEEDED_EXPONENT = 1.2;
const LEVEL_UP_MULTIPLIER = 1.2;

const INFO = "Level: {0}\nHP: {1}\nEnergy: {2}\nAgility: {3}\nStrength: {4}";

export default class Entity extends Mobile {

    /**
     * @param name
     * @param desc
     * @param parentPlace
     * @param xPos
     * @param yPos
     * @param level {int} Level of this
     * @param xp {int} Experienced gained when killing this
     * @param baseStats {int[]} Array of stats
     * @param hostility {int} 1 for hostile, 0 for friendly
     * @param inventory {Object} Keys are id numbers, values are quantity of item
     */
    constructor(name, desc, parentPlace, xPos, yPos, level, xp,
                baseStats, hostility, inventory) {
        super(name, desc, parentPlace, xPos, yPos);

        this.level = level;
        this.hostility = hostility;
        this.deathXP = xp;
        this.XP = 0;

        this.baseStats = baseStats;

        this.inventory = {};
        for(let itemID in inventory) {
            this.inventory[itemID] = inventory[itemID];
        }
        this.money = [0, 0, 0];

        this.currentStats = {};
        for(let i = 0; i < baseStats.length; i++) {
            this.currentStats[STAT_NAMES[i]] = baseStats[i];
        }
    }

    loseItem(itemID) {
        if(!this.inventory.hasOwnProperty(itemID)) {
            console.error("{0} does not have a {1}".format(this.name, itemID));
            return;
        }

        this.inventory[itemID]--;
        if(this.inventory[itemID] === 0) {
            delete this.inventory[itemID];
        }
    }

    addItem(itemID) {
        if(!this.inventory.hasOwnProperty(itemID)) {
            this.inventory[itemID] = 0;
        }
        this.inventory[itemID]++;
    }

    /**
     * Adds multiple items at a time
     * @param itemID {String} ID of the item being added
     * @param quantity {int} Quantity of item to add
     */
    addItems(itemID, quantity) {
        for(let i = 0; i < quantity; i++) {
            this.addItem(itemID);
        }
    }

    loot(entity) {
        for(let itemID in entity.inventory) {
            if(!this.inventory.hasOwnProperty(itemID)) {
                this.inventory[itemID] = 0;
            }
            this.inventory[itemID] += entity.inventory[itemID];
            delete entity.inventory[itemID];
        }
    }

    getInventoryItemNames() {
        let items = [];
        for(let itemID in this.inventory) {
            items.push(itemList[itemID].name);
        }
        return items;
    }

    gainMoney(amount) {
        for(let i = 0; i < MONEY_TYPES; i++) {
            this.money[i] += amount[i];
        }
    }

    gainHP(amount) {
        this.currentStats.hp += amount;
        if(this.currentStats.hp > this.baseStats[HP_INDEX]) {
            this.currentStats.hp = this.baseStats[HP_INDEX];
        }
    }

    gainEnergy(amount) {
        this.currentStats.energy += amount;
        if(this.currentStats.energy > this.baseStats[ENERGY_INDEX]) {
            this.currentStats.energy = this.baseStats[ENERGY_INDEX];
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
                return 1; // in addition to cost for Move
            case "Move":
                return 1;
            default:
                console.error(ERROR_UNKNOWN_ACTION.format(action));
                return 0;
        }
    }

    gainXP(amount) {
        this.XP += amount;
        console.log(GAIN_XP_TEXT.format(this.tag, amount, this.XP));

        let XPNeeded = Math.floor(
            Math.pow(this.level, XP_NEEDED_EXPONENT) * BASE_XP_LEVEL );
        if(this.XP >= XPNeeded) {
            this.XP -= XPNeeded;
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        for(let i = 0; i < TOTAL_STAT_COUNT; i++) {
            this.baseStats[i] = Math.floor(this.baseStats[i] * LEVEL_UP_MULTIPLIER);
        }

        this.deathXP = Math.floor(this.deathXP * LEVEL_UP_MULTIPLIER);

        console.log(LEVEL_UP_TEXT.format(this.tag, this.level));
    }

    rest() {
        console.log(this.tag + " rested");
        this.gainEnergy(REST_ENERGY_GAIN);
        this.gainHP(REST_HP_GAIN);
    }

    fatigue() {
        return this.currentStats.energy / this.baseStats[ENERGY_INDEX];
    }

    vitality() {
        return this.currentStats.hp / this.baseStats[HP_INDEX];
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

    /**
     * Clones a monster to a certain position
     * @param xPos
     * @param yPos
     * @returns {Entity}
     */
    clone(xPos, yPos) {
         return new Entity(this.name, this.desc, this.parentPlace, xPos,
             yPos, this.level, this.deathXP, this.baseStats, this.hostility,
             this.inventory);
    }
}
