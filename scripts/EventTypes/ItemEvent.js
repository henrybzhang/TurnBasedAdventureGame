import {me} from "../Data.js";
import Tool from "../Thing/ItemTypes/Tool.js";
import Consumable from "../Thing/ItemTypes/Consumable.js";
import Clothing from "../Thing/ItemTypes/Clothing.js";
import Event from '../Game/Event.js';
import Inventory from "./Inventory.js";

const ITEM_BUTTON_SET = ["Go Back", "Drop"];
Object.seal(ITEM_BUTTON_SET);

const EQUIP_TIME = 5;
const CONSUME_TIME = 5;

export default class ItemEvent extends Event {
    constructor(item, inventoryEvent) {
        super(item.name, item.desc, ITEM_BUTTON_SET.slice(), inventoryEvent, null);

        this.item = item;

        if(item instanceof Tool) {
            this.buttonSet.push("Equip");
        } else if(item instanceof Consumable) {
            this.buttonSet.push("Consume");
        } else if(item instanceof Clothing) {
            this.buttonSet.push("Equip");
        }
    }

    chooseNewEvent(command) {

        // nextEvent should be and inventory event
        switch(command) {
            case "Go Back":
                break;
            case "Drop":
                me.loseItem(this.item.name);
                break;
            case "Equip":
                // add equipping
                break;
            case "Consume":
                // add consuming
                break;
            default:
                console.error("{0} given to ItemEvent".format(command));
        }

        if(this.nextEvent instanceof Inventory) {
            this.nextEvent.update();
        }
        return this.nextEvent;
    }
}