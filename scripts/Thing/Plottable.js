"use strict";

import Thing from "./Thing.js";
import Template from "../Event/EventTypes/Template.js";
import Trade from "../Event/EventTypes/Trade.js";

/**
 * @classdesc A Thing that has a location on a map
 */
export default class Plottable extends Thing {

    /**
     * @param name
     * @param desc
     * @param parentPlace {Place} the name of the place this is in
     * @param xPos {int} the x Position of this
     * @param yPos {int} the y Position of this
     */
    constructor(name, desc, parentPlace, xPos, yPos) {
        super(name, desc);

        this.parentPlace = parentPlace;
        this.xPos = xPos;
        this.yPos = yPos;

        this.quests = {};

        this.addToParentPlace();
    }

    interact() {
        let eventObject = {};
        eventObject["Go Back"] = this.getTile().getEvent();
        eventObject["Trade"] = new Trade("Trade with " + this.name, this.desc,
                                            this, this.getTile().getEvent());
        for(let questName in this.quests) {
            let quest = this.quests[questName];
            if(quest.nextChapter.triggerEvent === "Talk") {
                eventObject[quest.nextChapter.name] = quest.nextChapter.rootEvent;
            }
        }
        return new Template("Interaction with " + this.name,
                                this.desc, eventObject);
    }

    info() {

    }

    addQuest(quest) {
        this.quests[quest.name] = quest;
    }

    addToParentPlace() {
        if(this.parentPlace == null) {
            if(this.parentPlace === undefined) {
                console.error(this.name + " has an undefined parentPlace");
            }
            return;
        }

        console.log("Adding {0} to {1}".format(this.name, this.parentPlace.name));

        this.parentPlace.addToPlot(this);
    }

    getTile() {
        return this.parentPlace.getTile(this.xPos, this.yPos);
    }
}