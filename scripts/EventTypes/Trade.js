import Event, {me} from '../Event.js';

const TRADE_BUTTON_SET = ["Buy", "Sell", "Go Back"];

export default class Trade extends Event {
    constructor(title, desc, npc, nextEvent) {
        super(title, desc, TRADE_BUTTON_SET, nextEvent, npc);
    }

    chooseNewEvent(command) {
        let toBuy = false;
        switch(command) {
            case "Buy":
                toBuy = true;
                return new Inventory(this.other, this);
            case "Sell":
                return new Inventory(me, this);
            case "Go Back":
                return this.nextEvent;

            // itemName was chosen
            default:
                if(toBuy === true) {
                    toBuy = false;
                    return buy(command);
                }
                return sell(command);
        }
    }

    buy(itemName) {

    }

}