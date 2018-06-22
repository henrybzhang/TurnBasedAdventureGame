import {Event} from './Event.js';
import {Tile} from '../Thing/Place/Tile.js';

const BUTTON_SET = ["Interact", "North", "Inventory", "West", "South", "East"];

export class Default extends Event {

    /**
     * @param {Tile} tile - A tile on a plot
     */
    constructor(tile) {
        super(tile.name, tile.desc, BUTTON_SET);
        console.log(tile.name);
    }

    chooseNewEvent(command, player) {
        switch(command) {
            case "Interact":
                break;
            case "North":
                player.move(0, -1);
                break;
            case "Inventory":
                break;
            case "West":
                player.move(-1, 0);
                break;
            case "South":
                player.move(0, 1);
                break;
            case "East":
                player.move(1, 0);
                break;
        }

        return new Default(player.getTile());
    }
}