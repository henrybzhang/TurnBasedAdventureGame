import {me} from '../Data.js';
import Event from '../Game/Event.js';
import Next from "./Next.js";

const DEFAULT_BUTTON_SET = ["", "North", "", "West", "Interact", "East", "", "South", "Rest"];

const INTERACT_TIME = 15;
const MOVE_TIME = 20;
const REST_TIME = 60;

const REST_STORY_TEXT = "You decide to take a break and rest for one hour.";

// TODO: perhaps return this instead of making a new event every time
export default class Default extends Event {

    /**
     * @param tile {Tile} A tile on a plot
     */
    constructor(tile) {
        super(tile.name, tile.desc, DEFAULT_BUTTON_SET, null, null);

        for(let plottableID in tile.onTileList) {
            if(plottableID === me.id) continue;
            this.storyText += tile.onTileList[plottableID].desc;
        }
    }

    chooseNewEvent(command) {
        let move = false;
        let nextEvent;
        switch(command) {
            case "Interact":
                nextEvent = me.getTile().interact();
                break;
            case "North":
                me.move(0, -1);
                move = true;
                break;
            case "West":
                me.move(-1, 0);
                move = true;
                break;
            case "South":
                me.move(0, 1);
                move = true;
                break;
            case "East":
                me.move(1, 0);
                move = true;
                break;
            case "Rest":
                me.rest();
                nextEvent = new Next("rest", REST_STORY_TEXT, me.getTile().getEvent());
                break;
            default:
                console.error("Unknown command given at default event: |{0}|".fmt(command));
        }
        if(move === true) {
        }

        if(nextEvent !== undefined) {
            return nextEvent;
        }

        return me.getTile().getEvent();
    }

    findTimeTaken(command) {
        switch(command) {
            case "Interact":    return INTERACT_TIME;
            case "Rest":        return REST_TIME;
            default:            return MOVE_TIME;
        }
    }

    canDo(action) {
        let xDelta = 0;
        let yDelta = 0;
        switch(action) {
            case "North":
                yDelta = -1;
                break;
            case "South":
                yDelta = 1;
                break;
            case "West":
                xDelta = -1;
                break;
            case "East":
                xDelta = 1;
                break;
        }

        if(me.checkMove(xDelta, yDelta) === -1) {
            return false;
        }

        if(action === "North" || action === "South" ||
            action === "West" || action === "East") {
            return me.energy() >= me.energyCost("Move");
        }

        if(action === "Interact") {
            return me.getTile().hasPlottables(me.id)
        }

        return true;
    }
}