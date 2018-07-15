import {itemList, me} from '../../Data.js';
import Event from '../Event.js';
import Next from './Next.js';
import Inventory from "./Inventory.js";

const TRADE_BUTTON_SET = ["Buy", "Sell", "Go Back"];

const TRADE_SUCCESS_TEXT = "{0} was successfully {1}.";
const TRADE_FAIL_TEXT = "{0} could not be {1} due to a deficit of {2}'s money.";

export default class Trade extends Event {
    constructor(title, storyText, npc, nextEvent) {
        super(title, storyText, TRADE_BUTTON_SET, nextEvent, npc);

        this.toBuy = false;
    }

    chooseNewEvent(command) {
        switch(command) {
            case "Buy":
                this.toBuy = true;
                return new Inventory(this.other, this);
            case "Sell":
                this.toBuy = false;
                return new Inventory(me, this);
            case "Go Back":
                return this.nextEvent;

            // itemName was chosen
            default:
               return this.trade(command);
        }
    }

    trade(itemName) {
        let seller = me;
        let buyer = this.other;
        let tradeType = "sold";
        if(this.toBuy === true) {
            this.toBuy = false;
            buyer = me;
            seller = this.other;
            tradeType = "bought";
        }

        let itemValue = itemList[itemName].getValue();

        let mainText = TRADE_FAIL_TEXT.format(itemName, tradeType, buyer.name);
        if(buyer.loseMoney(itemValue)) {
            seller.gainMoney(itemValue);
            seller.loseItem(itemName);
            buyer.gainItem(itemName);
            mainText = TRADE_SUCCESS_TEXT.format(itemName, tradeType);
        }

        return new Next(tradeType, mainText, this);
    }

}