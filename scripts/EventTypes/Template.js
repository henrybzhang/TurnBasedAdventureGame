import Event from '../Event.js';

export default class Template extends Event {
    constructor(title, desc, eventObject) {
        super(title, desc, Object.keys(eventObject));
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