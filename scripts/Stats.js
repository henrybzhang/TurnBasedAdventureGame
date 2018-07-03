"use strict";

const ERROR_NOT_ENOUGH_ENERGY = "Not enough energy";
const ERROR_UNKNOWN_ACTION = "Unknown action: {0}";

const MONEY_TYPE_LIST = ["gold", "silver", "copper"];
const MONEY_TYPES = MONEY_TYPE_LIST.length;
const CONVERSION_RATE = {
    "gold":     128,
    "silver":    16,
    "copper":     1
};

const STAT_NAMES = ["hp", "energy", "agility", "strength"];
const TOTAL_STAT_COUNT = STAT_NAMES.length;

const INFO = "Level: {0}\nHP: {1}\nEnergy: {2}\nAgility: {3}\nStrength: {4}";

const BASE_MULTIPLIER = 10;

export default class Stats {

    /**
     * @param level {int} Level of this
     * @param baseStats {int[]} Array of stats
     * @param inventory {String[]} List of itemNames
     */
    createStats(level, baseStats, inventory) {

        this.level = level;

        this.baseStats = {};
        for(let i = 0; i < TOTAL_STAT_COUNT; i++) {
            this.baseStats[STAT_NAMES[i]] = baseStats[i];
        }

        this.inventory = inventory;
        if(this.inventory == null) {
            this.inventory = [];
        }

        this.money = {
            "gold":     0,
            "silver":   0,
            "copper":   0
        };
        this.tempModifier = 1;

        this.currentStats = JSON.parse(JSON.stringify(this.baseStats));
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

    gainMoney(amount) {
        for(let moneyType in this.money) {
            this.money[moneyType] += amount[moneyType];
        }
    }

    loseMoney(amount) {
        let remainder = Stats.totalMoney(this.money) - Stats.totalMoney(amount);

        for(let moneyType in CONVERSION_RATE) {
            this.money[moneyType] = remainder / CONVERSION_RATE[moneyType];
            remainder -= this.money[moneyType] * CONVERSION_RATE[moneyType];
        }
    }

    enoughMoney(amount) {
        return Stats.totalMoney(this.money) >= Stats.totalMoney(amount);
    }

    totalMoney() {
        let total = 0;
        for(let moneyType in this.money) {
            total += this.money[moneyType] * CONVERSION_RATE[moneyType];
        }
        return total;
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
}

