import {Thing} from "./Thing.js";

/**
 * @member {Number} xPos - the x Position of this thing
 * @member {Number} yPos - the y Position of this thing
 */
export class Plottable extends Thing {
    constructor(name) {
        super(name);

        this.xPos = 0;
        this.yPos = 0;
    }

    getTile(plot) {
        return plot.getTile(this.xPos, this.yPos);
    }

    move(xDelta, yDelta) {
        this.xPos += xDelta;
        this.yPos += yDelta;
    }
}