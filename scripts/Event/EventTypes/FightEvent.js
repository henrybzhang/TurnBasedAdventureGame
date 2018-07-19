"use strict";

import Event from "../Event.js";
import {me} from "../../Data.js";
import Next from "./Next.js";
import Battle from "../../Battle.js";

const FIGHT_BUTTON_SET = ["Attack", "Defend", "Inventory", "Run"];
const FIGHT_TURN_TIME = 1;
const RUN_TIME = 30;

export default class FightEvent extends Event {
    /**
     *
     * @param name {String}
     * @param storyText {String}
     * @param nextEvent {Event} not used
     * @param opponents {Entity[]}
     */
    constructor(name, storyText, nextEvent, opponents) {
        super(name, storyText, FIGHT_BUTTON_SET, nextEvent, null);
        this.opponents = opponents;
    }

    // TODO: Potential bug if player runs from battle with 2+ opponents that are
    // TODO: hostile to each other
    chooseNewEvent(command) {

        switch(command) {
            case "Run":
                this.timeTaken = RUN_TIME;
                break;
            case "Inventory":
                break;
            default:
                this.timeTaken = FIGHT_TURN_TIME;
        }

        let participants = this.opponents.concat([me]);
        let battle = new Battle(participants, command);
        let storyText = battle.turn();

        if(battle.fighters.length === 1) {
            return new Next("Fight Over", storyText, me.getTile().getEvent());
        }
        return new Next("Fight Scene", storyText, this);
    }

    sideEffect() {
        console.log("Fight side effect");
    }

}