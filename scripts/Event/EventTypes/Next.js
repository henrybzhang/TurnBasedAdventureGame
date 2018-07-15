import Event from '../Event.js'

const NEXT_BUTTON_SET = ["Next"];

export default class Next extends Event {
    constructor(title, storyText, nextEvent) {
        super(title, storyText, NEXT_BUTTON_SET, nextEvent);
    }

    chooseNewEvent(command) {
        if(this.nextEvent === undefined) {
            console.error("There is nowhere to go after this event");
        }

        return this.nextEvent;
    }
}