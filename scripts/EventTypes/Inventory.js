import Event from '../Event.js';

export default class Inventory extends Event {
    constructor(person, nextEvent) {
        super(person + "'s Inventory", "Inventory Description");
    }
}