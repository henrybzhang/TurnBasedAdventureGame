import QuestEvent from './EventTypes/QuestEvent.js';
import {totalList} from "../Data.js";

export default class Chapter {
    /**
     * @param name {String} Name of this
     * @param triggerName {String} Name of the trigger
     * @param triggerEvent {String} Used to trigger this eventSeq
     * @param timeLength {int} Time it takes to go through this event (hours)
     * @param gain {Object} The items gained in this eventSeq
     * @param lose {Object} The items lost in this eventSeq
     * @param eventSeries {Object} The series of events in this eventSeq
     * @param quest {Quest} The quest this chapter is a part of
     */
    constructor(name, triggerName, triggerEvent, timeLength, gain, lose,
                eventSeries, quest) {
        this.name = name;
        this.triggerName = triggerName;
        this.triggerEvent = triggerEvent;
        this.timeLength = timeLength;
        this.gain = gain;
        this.lose = lose;

        this.eventSeries = eventSeries;
        this.quest = quest;
        this.rootEvent = this.createEvent(0);
    }

    /**
     * Recursively create the chapter events
     * @param index {int} The index of the event in eventSeries
     * @returns {QuestEvent} The event
     */
    createEvent(index) {
        let eventObject = {};

        let event = this.eventSeries[index];
        if(event === undefined) {
            console.log(this.eventSeries);
            console.log(index);
        }
        for(let child in event.children) {
            let nextIndex = event.children[child];

            if(typeof nextIndex !== "number") {
                console.error(this.eventSeries[index]);
                console.error("Has an invalid index");
            }

            if(nextIndex !== -1) {
                eventObject[child] = this.createEvent(nextIndex);
            } else {
                eventObject[child] = null;
            }
        }

        return new QuestEvent(String(index), event.text, eventObject,
                                this.eventSeries[index], this.quest);
    }

    addToPlottable() {
        console.log(this.triggerName);
        totalList[this.triggerName].quests.push(this);
    }
}