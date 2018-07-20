import {me, activeMonsters} from "../Data.js";

const BATTLE_INFO = "Battle between: ";

// storyText
const MISSING_ENERGY = "{0} is too weary to {1}\n";
const ATTACK_TEXT = "{0} attacks {1} for {2} damage.\n";
const DEAD_TEXT = "{0} has died in this battle";
const ESCAPE_TEXT = "{0} has ran away from this battle";
const DEFEND_TEXT = "{0} took a defensive stance";
const FIGHT_END_TEXT = "\n\nThe fight between {0} and {1} has ended. {0} emerges victorious.\n";

const DEFEND_MODIFIER = 1.5;

// Crit chance:  0.1 * x ^ 3.3219
// x = 1, chance = 10%
// x = 2, chance = 100%
const CRIT_CHANCE_POWER = 3.321928095;
const CRIT_CHANCE_LINEAR = 10;

const CRIT_DAMAGE_MODIFIER = 3;

// Attack, Defend, Run
const NUMBER_OF_ACTIONS = 3;

/**
 * Can either be battle or turn by turn fight scene
 */
export default class Battle {

    /**
     * @param entityList {Entity[]} List of entities involved in this battle
     * @param command {String} The player's action if involved
     */
    constructor(entityList, command) {
        if(entityList.length >= 3) console.error("More than three fighters");

        let includesPlayer = false;

        this.entityList = entityList;
        this.totalXP = 0;

        this.actionOccurred = false;

        // list of objects of Fighter class defined below
        this.fighters = [];
        for(let entity of entityList) {
            let fighter = new Fighter(entity, this.chooseAction(entity));
            if(entity === me) {
                fighter = new Fighter(entity, command);
                includesPlayer = true;
            }

            this.fighters.push(fighter);
        }

        this.fighters.sort(function(a, b){ return b.speed - a.speed});

        if(includesPlayer === true) {
            return;
        }

        this.battle();
    }

    /**
     * A turn of the battle
     * @returns {String} storyText -- unneeded if player is not part of battle
     */
    turn() {
        let storyText = "";

        // checks if an action occurred this time
        this.actionOccurred = false;

        for(let i = 0; i < this.fighters.length; i++) {
            let self = this.fighters[i];

            // randomly choose an enemy
            let enemy = self;
            while(enemy === self) {
                let randomEnemy = Math.floor(Math.random() * this.fighters.length);
                enemy = this.fighters[randomEnemy];
            }

            // self does not have enough energy to perform the chosen action
            if(self.actionSuccess === false) {
                storyText += MISSING_ENERGY.format(self.name, self.command);
                console.log("{0} could not perform {1} due to lack of energy"
                    .format(self.name, self.command));
                continue;
            }
            this.actionOccurred = true;

            switch(self.command) {
                case "Attack":
                    // between 0 and 1
                    let critChance = 1 / CRIT_CHANCE_LINEAR *
                        Math.pow(self.entity.agility() / enemy.entity.agility(),
                            CRIT_CHANCE_POWER);
                    let damageModifier = 1;
                    if(Math.random() < critChance) {
                        damageModifier = CRIT_DAMAGE_MODIFIER;
                    }

                    let damage = Math.floor(self.attack / enemy.defense *
                        damageModifier);

                    if(damage === 0) damage = damageModifier;
                    enemy.entity.loseHP(damage);

                    storyText += ATTACK_TEXT.format(self.name, enemy.name, damage);
                    console.log(ATTACK_TEXT.format(self.entity.tag,
                        enemy.entity.tag, damage));

                    // battle has ended when the enemy dies
                    if(enemy.entity.hp() === 0) {

                        // check if player lost the battle
                        if(enemy.entity === me) {
                            // TODO: go to Losing Screen
                            console.error("You Lost");
                        }

                        self.entity.loot(enemy.entity);

                        // remove dead from this battle, activeMonsters, plot
                        let index = this.fighters.indexOf(enemy);
                        this.fighters.splice(index, 1);

                        this.totalXP += enemy.entity.deathXP;
                        enemy.entity.getTile().removePlottable(enemy.entity);
                        delete activeMonsters[enemy.entity.id];

                        console.log(DEAD_TEXT.format(enemy.entity.tag));
                        storyText += DEAD_TEXT.format(enemy.name);

                        // no more enemies left
                        if(this.fighters.length === 1) {
                            storyText += FIGHT_END_TEXT.format(self.name, enemy.name);
                        }
                    }
                    break;

                case "Defend":
                    self.defense *= DEFEND_MODIFIER;

                    storyText += self.name + " took a defensive stance.";
                    console.log(DEFEND_TEXT.format(self.entity.tag));
                    break;

                case "Run":
                    // randomly choose an adjacent square to run to
                    let random = Math.floor(Math.random() * 4);
                    switch(random) {
                        case 0:
                            self.entity.move(0, -1);
                            break;
                        case 1:
                            self.entity.move(0, 1);
                            break;
                        case 2:
                            self.entity.move(1, 0);
                            break;
                        case 3:
                            self.entity.move(-1, 0);
                            break;
                    }

                    let index = this.fighters.indexOf(self);
                    this.fighters.splice(index, 1);

                    storyText += ESCAPE_TEXT.format(self.name);
                    console.log(ESCAPE_TEXT.format(self.entity.tag));
            }

            // energy cost may be dependent on entity
            self.entity.loseEnergy(self.entity.energyCost(self.command));

            if(this.fighters.length === 1){
                break;
            }
        }

        // reset modifiers after each round
        for(let i = 0; i < this.fighters.length; i++) {
            this.fighters[i].attack = this.fighters[i].entity.strength();
            this.fighters[i].defense = this.fighters[i].entity.strength();
        }

        return storyText;
    }

    /**
     * Repeatedly call turn until there is only one fighter left
     */
    battle() {
        let battleText = BATTLE_INFO;
        for(let fighter of this.fighters) {
            battleText += fighter.entity.tag + ", ";
        }
        console.log(battleText);

        while(this.fighters.length > 1) {
            // randomly choose an action for each fighter each time
            for(let fighter of this.fighters) {
                fighter.setCommand(this.chooseAction(fighter.entity));
            }
            this.fighters.sort(function(a, b){ return b.speed - a.speed});

            this.turn();

            if(this.actionOccurred === false) {
                console.log("Everyone is too tired to fight");
                for(let fighter of this.fighters) {
                    fighter.entity.rest();
                }
                break;
            }
        }
    }

    /**
     * Randomly chooses an action for the entity to take
     * @param entity
     * @returns {string}
     */
    chooseAction(entity) {
        let randomAction = Math.floor(Math.random() * 3);
        switch(randomAction) {
            case 0: return "Attack";
            case 1: return "Defend";
            case 2: return "Attack";
        }
    }

    static actionSpeed(command) {
        switch(command) {
            case "Attack":        return 1;
            case "Defend":        return 2;
            case "Inventory":     return 1;
            case "Run":         return 3;
        }
    }

}
class Fighter {
    /**
     * @param {Entity} entity
     * @param {String} command
     */
    constructor(entity, command) {
        this.name = entity.name;
        this.entity = entity;
        this.defense = entity.strength();
        this.attack = entity.strength();

        this.setCommand(command);
    }

    setCommand(command) {
        this.command = command;
        this.actionSuccess = this.entity.energy() >= this.entity.energyCost(command);

        // larger number is faster
        this.speed = this.entity.agility() * this.entity.fatigue() *
                        Battle.actionSpeed(command);
    }
}
