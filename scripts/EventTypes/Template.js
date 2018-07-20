import Event from '../Game/Event.js';

export default class Template extends Event {
    constructor(title, storyText, eventObject) {
        super(title, storyText, Object.keys(eventObject), undefined, undefined);
        this.eventObject = eventObject;
    }

    chooseNewEvent(command) {
        if(command in this.eventObject) {
            return this.eventObject[command];
        }
        console.log("{0} not found in Template class".format(command));
        return this;
    }
}