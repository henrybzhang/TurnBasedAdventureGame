"use strict";

import Event, {me} from "../Event.js";
import Next from "./Next.js";

const MISSING_ENERGY = "{0} does not have enough energy to do anything\n";
const ATTACK_TEXT = "{0} attacks {1} for {2} damage.\n";
const FIGHT_END_TEXT = "The fight between {0} and {1} has ended. {0} emerges victorious.\n";

const FIGHT_BUTTON_SET = ["Attack", "Defend", "Inventory", "Run"];

const DEFENSE_MODIFIER = 0.5;

export default class Fight extends Event {
    /**
     *
     * @param name {String}
     * @param desc {String}
     * @param nextEvent {Event}
     * @param opponent {Entity}
     */
    constructor(name, desc, nextEvent, opponent) {
        super(name, desc, FIGHT_BUTTON_SET, nextEvent, opponent);
    }

    chooseNewEvent(command) {
        class Fighter {
            /**
             * @param {Entity} entity
             * @param {String} command
             */
            constructor(entity, command) {
                this.name = entity.name;
                this.entity = entity;
                this.command = command;

                // faster is larger number
                this.speed = entity.agility() * entity.fatigue() *
                                Fight.actionSpeed(command);

                this.actionSuccess = entity.energy() >= entity.energyCost(command);
            }
        }

        let entities = [new Fighter(me, command),
                            new Fighter(this.other, command)];
        entities.sort(function(a, b){ return b.speed - a.speed});

        let storyText = "";
        let nextEvent = null;

        for(let i = 0; i < entities.length; i++) {
            let self = entities[i];
            let enemy = entities[1 - i]; // only two entities total

            if(self.actionSuccess === false) {
                storyText += MISSING_ENERGY.format(self.name);
                console.log("{0} could not perform {1} due to lack of energy".format(
                    self.name, self.command
                ));
                continue;
            }

            switch(self.command) {
                case "Attack":
                    let damage = self.entity.strength() / enemy.entity.strength() *
                        self.entity.tempModifier * enemy.entity.tempModifier;

                    if(damage === 0) damage = 1;
                    enemy.entity.loseHP(damage);

                    storyText += ATTACK_TEXT.format(self.name, enemy.name, damage);

                    // battle has ended
                    if(enemy.entity.hp() === 0) {

                        storyText += "\n\n" + FIGHT_END_TEXT.format(self.name,
                            enemy.name);

                        // player lost the battle
                        if(enemy.name === me.name) {
                            // TODO: go to Losing Screen
                            console.log("You Lost");
                        }

                        self.loot(enemy);

                        nextEvent = new Next("Won battle vs. " + enemy.name,
                            storyText, me.getTile().getEvent());
                    }
                    break;

                case "Defend":
                    self.entity.tempModifier *= DEFENSE_MODIFIER;
                    break;

                case "Run":
                    // TODO: Potential bug where player's name is the same as a npc's name
                    if(self.name !== me.name) {
                        continue;
                    }

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

                    // next event depends on the square landed on
                    nextEvent = me.getTile().getEvent();
            }

            self.entity.loseEnergy(self.entity.energyCost(self.command));

            // Something happened, next person's action doesn't matter anymore
            if(nextEvent != null){
                break;
            }
        }

        // reset modifiers after each round
        for(let i = 0; i < entities.length; i++) {
            let temp = entities[i];
            temp.entity.tempModifier = 1;
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