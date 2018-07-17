import Event from '../Event.js';
import Trade from "./Trade.js";
import {itemList} from "../../Data.js";
import ItemEvent from "./ItemEvent.js";
import {findObj} from "../../Miscellaneous.js";

const ITEM_DESC = "{0}({1}) - {2}\n";

export default class Inventory extends Event {
    constructor(person, nextEvent) {
        super(person.name + "'s Inventory", null, person.getInventoryItemNames(),
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
        return new ItemEvent(findObj(command, itemList), this);
    }

    update() {
        this.storyText = "";
        for(let itemID in this.self.inventory) {
            this.storyText += ITEM_DESC.format(itemList[itemID].name,
                this.self.inventory[itemID], itemList[itemID].desc);
        }
        if(this.storyText === "") {
            this.storyText = "You have an empty inventory";
        }

        this.buttonSet = this.self.getInventoryItemNames();
        this.buttonSet.push("Go Back");
    }
}