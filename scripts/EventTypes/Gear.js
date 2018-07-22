import Event from "../Game/Event.js";
import Next from "./Next.js";
import {me, itemList} from "../Data.js";
import Template from "./Template.js";

export const GEAR_SET = ["Headgear", "Armor", "Glove", "Footwear",
    "Weapon"];

const GEAR_CHOICE_TEXT = "Which slot do you want to modify?\n";
const ITEM_CHOICE_TEXT = "Which item do you want to equip?\n";
const GEAR_TEXT = "You equipped {0} to {1}.\n";

export default class Gear extends Event {
    constructor(nextEvent) {
        super(me.name + "'s Gear", GEAR_CHOICE_TEXT, GEAR_SET.slice(),
            nextEvent, null);

        this.buttonSet.push("Go Back");
        this.toEquip = false;
    }

    chooseNewEvent(command) {
        if (command === "Go Back") {
            return this.nextEvent;
        }

        // command is an item to equip
        if(this.toEquip) {
            this.toEquip = false;
            me.equip(command);
            return this;
        }

        // command is a slot subType to equip for
        if (!this.toEquip) {
            this.toEquip = true;
            let eventObject = {
                "Go Back" : this
            };

            for (let itemID in me.inventory) {
                let item = itemList[itemID];
                if (item.subType === command) {
                    eventObject[item.name] = new Next("Equipping " + item.name,
                        GEAR_TEXT.format(item.name, command), this, item.name);
                }
            }

            return new Template("Equip", ITEM_CHOICE_TEXT, eventObject);
        }
    }
}