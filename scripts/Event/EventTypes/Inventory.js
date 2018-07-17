import Event from '../Event.js';
import Trade from "./Trade.js";
import {itemList} from "../../Data.js";
import ItemEvent from "./ItemEvent.js";

const ITEM_DESC = "{0}({1}) - {2}\n";

export default class Inventory extends Event {
    constructor(person, nextEvent) {
        super(person.name + "'s Inventory", null, Object.keys(person.inventory),
            nextEvent, null);
        this.self = person;

        this.update();
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
        return new ItemEvent(itemList[command], this);
    }

    update() {
        this.storyText = "";
        for(let itemName in this.self.inventory) {
            this.storyText += ITEM_DESC.format(itemName,
                this.self.inventory[itemName], itemList[itemName].desc);
        }
        if(this.storyText === "") {
            this.storyText = "You have an empty inventory";
        }

        this.buttonSet = Object.keys(this.self.inventory);
        this.buttonSet.push("Go Back");
    }
}