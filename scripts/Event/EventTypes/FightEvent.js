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
     * @param nextEvent {Event}
     * @param opponent {Entity}
     */
    constructor(name, storyText, nextEvent, opponent) {
        super(name, storyText, FIGHT_BUTTON_SET, nextEvent, opponent);
    }

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

        let participants = [this.other];
        let battle = new Battle(participants, true, command);
        let storyText = battle.turn();

        if(battle.battleOver === true) {
            return new Next("Fight Over", storyText, me.getTile().getEvent());
        }
        return new Next("Fight Scene", storyText, this);
    }

    sideEffect() {
        console.log("Fight side effect");
    }

}