import {Thing} from "./Thing.js";

/**
 * @member {Number} xPos - the x Position of this thing
 * @member {Number} yPos - the y Position of this thing
 * @member {Place} place - the place of this thing
 *
 * A Thing that has a location on a map
 */
export class Plottable extends Thing {
    constructor(name, desc, place, xPos, yPos) {
        super(name, desc);

        this.place = place;
        this.xPos = xPos;
        this.yPos = yPos;
    }
}