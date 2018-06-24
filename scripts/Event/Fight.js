import Event from "./Event.js";
import Entity from "../Entity.js";
import Next from "./Next.js";

const ERROR_NULL_ENEMY = "{0}'s enemy is null";

const ATTACK_TEXT = "{0} attacks {1} for {2} damage.\n";
const FIGHT_END_TEXT = "The fight between {0} and {1} has ended. {0} emerges victorious.\n";

const BUTTON_SET = ["Attack", "Defend", "Inventory", "Run"];

const DEFENSE_MODIFIER = 0.5;

export default class Fight extends Event {
    /**
     *
     * @param name {String}
     * @param desc {String}
     * @param nextEvent {Event}
     * @param opponent {Mobile}
     */
    constructor(name, desc, nextEvent, opponent) {
        super(name, desc, BUTTON_SET, nextEvent, opponent);
    }

    chooseNewEvent(command, player) {
        class Participant extends Entity {
            /**
             * @param {String} name
             * @param {Entity} entity
             * @param {String} command
             */
            constructor(name, entity, command) {
                super(entity.level, entity.baseStats, entity.inventory);
                this.name = name;
                this.command = command;

                // faster is larger number
                this.speed = entity.getAgility() * entity.getFatigue() *
                                Fight.actionSpeed(command);

                this.actionSuccess =
                    entity.getEnergy() > entity.energyCost(command);
            }
        }

        let participants = [new Participant(player.name, player.entity, command),
                            new Participant(this.other.name, this.other.entity, command)];
        participants.sort(function(a, b){ return a.speed - b.speed});

        let storyText = "";
        let nextEvent = null;

        for(let i = 0; i < participants.length; i++) {
            let self = participants[i];
            let enemy = participants[1 - i]; // only two participants total
            if(self.actionSuccess === false) {
                console.log("{0} could not perform {1} due to lack of energy".format(
                    participants.name, command
                ))
            }

            switch(command) {
                case "Attack":
                    let damage = self.getStrength() *
                        self.tempModifier * enemy.tempModifier;

                    if(damage === 0) damage = 1;
                    enemy.loseHP(damage);

                    storyText += ATTACK_TEXT.format(self.name, enemy.name, damage);

                    // battle has ended
                    if(enemy.getHP() === 0) {

                        storyText += "\n\n" + FIGHT_END_TEXT.format(self.name,
                            enemy.name);

                        // player lost the battle
                        if(enemy.name === player.name) {
                            // TODO: go to Losing Screen
                            console.log("You Lost");
                        }

                        nextEvent = new Next("Won battle vs. " + enemy.name,
                            storyText, player.getTile().getEvent());
                    }
                    break;

                case "Defend":
                    self.tempModifier *= DEFENSE_MODIFIER;
                    break;

                case "Run":
                    // TODO: Potential bug where player's name is the same as a npc's name
                    if(self.name !== player.name) {
                        continue;
                    }

                    // randomly choose an adjacent square to run to
                    let random = Math.floor(Math.random() * 4);
                    switch(random) {
                        case 0: player.move(0, -1);
                        case 1: player.move(0, 1);
                        case 2: player.move(1, 0);
                        case 3: player.move(-1, 0);
                    }

                    // next event depends on the square landed on
                    nextEvent = player.getTile().getEvent();
            }

            self.loseEnergy(self.energyCost(command));

            // Something happened, next person's action doesn't matter anymore
            if(nextEvent != null){
                break;
            }
        }

        // reset modifiers after each round
        for(let i = 0; i < participants.length; i++) {
            let temp = participants[i];
            temp.tempModifier = 1;
        }

        if(nextEvent == null) {
            nextEvent = new Next("Battle Scene", storyText, this);
        }

        return nextEvent;
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