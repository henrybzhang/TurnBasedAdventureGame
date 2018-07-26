"use strict";

import {me} from "../Data.js";
import Battle from "../Game/Battle.js";
import Event from "../Game/Event.js";
import Next from "./Next.js";
import Template from "./Template.js";

const FIGHT_BUTTON_SET = ["Attack", "Defend", "Inventory", "Run"];
const FIGHT_TURN_TIME = 1;
const RUN_TIME = 30;

export default class FightEvent extends Event {
    /**
     *
     * @param title
     * @param storyText {String}
     * @param nextEvent {Event} not used
     * @param opponents {Entity[]}
     */
    constructor(title, storyText, nextEvent, opponents) {
        super(title, storyText, FIGHT_BUTTON_SET, nextEvent, opponents[0]);
        this.opponents = opponents;
    }

    // TODO: Potential bug if player runs from battle with 2+ opponents that are
    // TODO: hostile to each other, because they need to finish the fight
    chooseNewEvent(command) {

        let participants = this.opponents.concat([me]);
        let battle = new Battle(participants, command);
        let storyText = battle.turn();

        if (battle.fighters.length === 1) {
            let nextEvent;
            if (me.isAlive === false) {
                nextEvent = new Template("Player Died",
                    "You died.\n\nGAME OVER", {}, null);
            } else {
                nextEvent = me.getTile().getEvent();
                if (command !== "Run") {
                    storyText += me.gainXP(battle.totalXP);

                    for (let opponent of this.opponents) {
                        storyText += me.loot(opponent);
                    }
                }
            }

            return new Next("Fight Over", storyText, nextEvent);
        }
        return new Next("Fight Scene", storyText, this);
    }

    fightInfo() {
        let temp = "\n";
        for (let opponent of this.opponents) {
            temp += opponent.name + '\n';
        }
        return temp;
    }
}