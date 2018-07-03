import Event, {me} from '../Event.js';

const DEFAULT_BUTTON_SET = ["Interact", "North", "Inventory", "West", "South", "East"];

// TODO: perhaps return this instead of making a new event every time
export default class Default extends Event {

    /**
     * @param tile {Tile} A tile on a plot
     */
    constructor(tile) {
        super(tile.name, tile.desc, DEFAULT_BUTTON_SET);
        console.log(tile.name);
    }

    canDo(action) {
        return me.energy() >= me.energyCost("Move");
    }

    chooseNewEvent(command) {
        let move = false;
        let nextEvent = null;
        switch(command) {
            case "Interact":
                nextEvent = me.getTile().interact();
                break;
            case "North":
                me.move(0, -1);
                move = true;
                break;
            case "Inventory":
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
        }

        if(nextEvent != null) {
            return nextEvent;
        }
        return me.getTile().getEvent();
    }
}