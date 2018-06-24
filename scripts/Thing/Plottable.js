"use strict";

import Thing from "./Thing.js";
import {placeList} from "../Data.js";

/**
 * @classdesc A Thing that has a location on a map
 */
export default class Plottable extends Thing {

    /**
     * @param name {String} the name of this
     * @param desc {String} the description of this
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

    addToParentPlace() {
        if(this.parentPlace == null) return;

        console.log("Adding {0} to {1}".format(this.name, this.parentPlace.name));

        this.parentPlace.addToPlot(this);
    }

    getTile() {
        return this.parentPlace.getTile(this.xPos, this.yPos);
    }
}