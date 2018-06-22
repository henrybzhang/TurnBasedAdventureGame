"use strict";

import {Thing} from "./Thing.js";
import {placeList} from "./Place/Place.js";

/**
 * @classdesc A Thing that has a location on a map
 */
export class Plottable extends Thing {

    /**
     * @param {String} name - the name of this
     * @param {String} desc - the description of this
     * @param {String} place - the name of the place this is in
     * @param {int} xPos - the x Position of this
     * @param {int} yPos - the y Position of this
     */
    constructor(name, desc, place, xPos, yPos) {
        super(name, desc);

        this.place = place;
        this.xPos = xPos;
        this.yPos = yPos;

        this.addToParentPlace();
    }

    addToParentPlace() {
        if(this.place == null) return;

        console.log("Adding {0} to {1}".format(this.name, this.place));

        let place = placeList[this.place];

        place.addToPlot(this);
    }

    getTile() {
        let place = placeList[this.place];
        return place.getTile(this.xPos, this.yPos);
    }
}