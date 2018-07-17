import {me} from "./Data.js";

const MISSING_ENERGY = "{0} does not have enough energy to {1}\n";
const ATTACK_TEXT = "{0} attacks {1} for {2} damage.\n";
const FIGHT_END_TEXT = "\n\nThe fight between {0} and {1} has ended. {0} emerges victorious.\n";

const DEFEND_MODIFIER = 0.5;

// Attack, Defend, Run
const NUMBER_OF_ACTIONS = 3;

/**
 * Can either be battle or turn by turn fight scene
 */
export default class Battle {

    /**
     * @param entityList {Entity[]} List of entities involved in this battle
     * @param includesPlayer {boolean} Whether the player is involved
     * @param command {String} The player's action if involved
     */
    constructor(entityList, includesPlayer, command) {
        this.battleOver = false;

        this.fighters = [];
        for(let entity of entityList) {
            let fighter = new Fighter(entity, this.chooseAction(entity));
            if(entity === me) fighter = new Fighter(entity, command);

            this.fighters.push(fighter);
        }

        this.fighters.sort(function(a, b){ return b.speed - a.speed});

        if(includesPlayer === true) {
            return;
        }
        this.battle();
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
            case 2: return "Run";
        }
    }

    /**
     * A turn of the battle
     * @returns {String} storyText -- unneeded if player is not part of battle
     */
    turn() {
        let storyText = "";

        for(let i = 0; i < this.fighters.length; i++) {
            let self = this.fighters[i];
            let enemy = this.fighters[1 - i]; // only two fighters total for now

            // self does not have enough energy to perform the chosen action
            if(self.actionSuccess === false) {
                storyText += MISSING_ENERGY.format(self.name, self.command);
                console.log("{0} could not perform {1} due to lack of energy"
                    .format(self.name, self.command));
                continue;
            }

            switch(self.command) {
                case "Attack":
                    let damage = Math.floor(self.entity.strength() / enemy.entity.strength() *
                        self.entity.tempModifier * enemy.entity.tempModifier);

                    if(damage === 0) damage = 1;
                    enemy.entity.loseHP(damage);
                    storyText += ATTACK_TEXT.format(self.name, enemy.name, damage);

                    // battle has ended when the enemy dies
                    if(enemy.entity.hp() === 0) {

                        storyText += FIGHT_END_TEXT.format(self.name, enemy.name);

                        // check if player lost the battle
                        if(enemy.entity === me) {
                            // TODO: go to Losing Screen
                            console.log("You Lost");
                        }

                        self.entity.loot(enemy.entity);
                        this.battleOver = true;
                    }
                    break;

                case "Defend":
                    self.entity.tempModifier *= DEFEND_MODIFIER;
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
                    this.battleOver = true;

                    if(self.entity === me) {
                        storyText += "You ran away.\n";
                    }
            }

            // energy cost may be dependent on entity
            self.entity.loseEnergy(self.entity.energyCost(self.command));

            if(this.battleOver === true){
                break;
            }
        }

        // reset modifiers after each round
        for(let i = 0; i < this.fighters.length; i++) {
            this.fighters[i].entity.tempModifier = 1;
        }

        return storyText;
    }

    /**
     * Repeatedly call turn until there is only one fighter left
     */
    battle() {
        while(this.battleOver === false) {
            // randomly choose an action for each fighter each time
            for(let fighter of this.fighters) {
                fighter.setCommand(this.chooseAction(fighter.entity));
            }
            this.fighters.sort(function(a, b){ return b.speed - a.speed});

            console.log(this.turn());
        }
    }

    static actionSpeed(command) {
        switch(command) {
            case "Attack":      return 1;
            case "Defend":      return 2;
            case "Inventory":   return 1;
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

        this.setCommand(command);
        this.actionSuccess = entity.energy() >= entity.energyCost(command);
    }

    setCommand(command) {
        this.command = command;

        // larger number is faster
        this.speed = this.entity.agility() * this.entity.fatigue() *
                        Battle.actionSpeed(command);
    }
}
