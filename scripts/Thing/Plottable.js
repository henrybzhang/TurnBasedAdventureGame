"use strict";

import {placeList} from "../Data.js";
import Thing from "./Thing.js";
import Template from "../EventTypes/Template.js";
import Trade from "../EventTypes/Trade.js";

/**
 * @classdesc A Thing that has a location on a map
 */
export default class Plottable extends Thing {

    /**
     * @param name
     * @param desc
     * @param parentPlaceName {String} the name of the place this is in
     * @param xPos {int} the x Position of this
     * @param yPos {int} the y Position of this
     */
    constructor(name, desc, parentPlaceName, xPos, yPos) {
        super(name, desc);

        this.parentPlace = placeList[parentPlaceName];
        this.xPos = xPos;
        this.yPos = yPos;

        this.addToParentPlace();
    }

    interact() {
        let eventObject = {};
        eventObject["Go Back"] = this.getTile().getEvent();
        eventObject["Trade"] = new Trade("Trade with " + this.name, this.desc,
                                            this, this.getTile().getEvent(););
        return new Template("Interaction with " + this.name,
                                this.desc, eventObject);
    }

    addToParentPlace() {
        if(this.parentPlace == null) return;

        console.log("Adding {0} to {1}".format(this.name, this.parentPlace.name));

        this.parentPlace.addToPlot(this);
    }

    getTile() {
        return this.parentPlace.getTile(this.xPos, this.yPos);
    }
}