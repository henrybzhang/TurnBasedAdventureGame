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

const TOTAL_STAT_COUNT = 4;

const BASE_MULTIPLIER = 10;

export default class Entity {

    constructor(level, baseStats, inventory) {

        this.level = level;
        this.baseStats = baseStats;
        this.inventory = inventory;

        this.money = {
            "gold":     0,
            "silver":   0,
            "copper":   0
        };
        this.tempModifier = 1;

        this.currentStats = JSON.parse(JSON.stringify(this.baseStats));
    }

    loseHP(amount) {
        this.currentStats.hp -= amount;
        if(this.currentStats.hp < 0){
            this.currentStats.hp = 0;
        }
    }

    loseEnergy(amount) {
        this.currentStats.energy -= amount;
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
            case "Move":
                return 3;
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
        let remainder = Entity.totalMoney(this.money) - Entity.totalMoney(amount);

        for(let moneyType in CONVERSION_RATE) {
            this.money[moneyType] = remainder / CONVERSION_RATE[moneyType];
            remainder -= this.money[moneyType] * CONVERSION_RATE[moneyType];
        }
    }

    enoughMoney(amount) {
        return Entity.totalMoney(this.money) >= Entity.totalMoney(amount);
    }

    static totalMoney(amount) {
        let total = 0;
        for(let moneyType in amount) {
            total += amount[moneyType] * CONVERSION_RATE[moneyType];
        }
        return total;
    }

    getFatigue() {
        return this.currentStats.energy / this.baseStats.energy;
    }

    getHP() {
        return this.currentStats.hp;
    }

    getEnergy() {
        return this.currentStats.energy;
    }

    getAgility() {
        return this.currentStats.agility;
    }

    getStrength() {
        return this.currentStats.strength;
    }
}

