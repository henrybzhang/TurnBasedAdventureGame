"use strict";

import {me} from "../Data.js";
import Battle from "../Game/Battle.js";
import Event from "../Game/Event.js";
import Next from "./Next.js";

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
        super(title, storyText, FIGHT_BUTTON_SET, nextEvent, null);
        this.opponents = opponents;
    }

    // TODO: Potential bug if player runs from battle with 2+ opponents that are
    // TODO: hostile to each other, because they need to finish the fight
    chooseNewEvent(command) {

        // switch(command) {
        //     case "Run":
        //         this.timeTaken = RUN_TIME;
        //         break;
        //     case "Inventory":
        //         break;
        //     default:
        //         this.timeTaken = FIGHT_TURN_TIME;
        // }

        let participants = this.opponents.concat([me]);
        let battle = new Battle(participants, command);
        let storyText = battle.turn();

        if(battle.fighters.length === 1) {
            return new Next("Fight Over", storyText, me.getTile().getEvent());
        }
        return new Next("Fight Scene", storyText, this);
    }

    sideEffect() {}

    fightInfo() {
        let temp = "\n";
        for(let opponent of this.opponents) {
            temp += opponent.name + '\n';
        }
    }
}