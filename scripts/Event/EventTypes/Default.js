import {me} from '../../Data.js';
import Event from '../Event.js';
import Inventory from "./Inventory.js";

const DEFAULT_BUTTON_SET = ["Interact", "North", "Inventory", "West", "South", "East"];

const INTERACT_TIME = 15;
const MOVE_TIME = 15;

// TODO: perhaps return this instead of making a new event every time
export default class Default extends Event {

    /**
     * @param tile {Tile} A tile on a plot
     */
    constructor(tile) {
        super(tile.name, tile.desc, DEFAULT_BUTTON_SET, null, null);
        console.log(tile.name);
        console.log('\n');
    }

    chooseNewEvent(command) {
        let move = false;
        let nextEvent;
        switch(command) {
            case "Interact":
                nextEvent = me.getTile().interact();
                this.timeTaken = INTERACT_TIME;
                break;
            case "North":
                me.move(0, -1);
                move = true;
                break;
            case "Inventory":
                console.log(me.inventory);
                nextEvent = new Inventory(me, this);
                this.timeTaken = 0;
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
            default:
                console.error("Unknown command given at default event: {0}".format(command));
        }
        if(move === true) {
            me.loseEnergy(me.energyCost("Move"));
            this.timeTaken = MOVE_TIME;
        }

        if(nextEvent !== undefined) {
            return nextEvent;
        }

        console.log("List of Plottables on tile:");
        console.log(me.getTile().onTileList);

        return me.getTile().getEvent();
    }

    sideEffect() {
        console.log("Default side effect");
    }

    canDo(action) {
        if(action === "North" || action === "South" ||
            action === "West" || action === "East") {
            return me.energy() >= me.energyCost("Move");
        }

        return true;
    }
}