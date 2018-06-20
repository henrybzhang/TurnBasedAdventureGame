import {Event} from './Event.js';

const BUTTON_SET = ["Interact", "North", "Inventory", "West", "South", "East"];

export class Default extends Event {

    constructor(tile) {
        super(tile.name, tile.desc, BUTTON_SET);
    }

    chooseEvent(command, player) {
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
    }
}