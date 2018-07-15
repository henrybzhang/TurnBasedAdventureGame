import Event from '../Event.js';
import Trade from "./Trade.js";

export default class Inventory extends Event {
    constructor(person, nextEvent) {
        super(person + "'s Inventory", "Inventory Description",
            person.getInventory(), nextEvent);

        this.buttonSet.push("Go Back");
    }

    chooseNewEvent(command) {
        if(command === "Go Back") {
            return this.nextEvent;
        }

        // came from a trade Event
        if(this.nextEvent instanceof Trade) {
            return this.nextEvent.chooseNewEvent(command);
        }

        // normal check of player's inventory
        return this.nextEvent;
    }
}