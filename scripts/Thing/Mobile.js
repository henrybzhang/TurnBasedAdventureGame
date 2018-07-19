"use strict";

import Plottable from "./Plottable.js";
import {me} from "../Data.js";

const OUT_OF_BOUNDS = "{0} is trying to move {1} which is Out of Bounds";
const ERROR_LEAVE_PLACE = "No specific direction when exiting {0}";

export default class Mobile extends Plottable {
    constructor(name, desc, parentPlace, xPos, yPos) {
        super(name, desc, parentPlace, xPos, yPos);
    }

    move(xDelta, yDelta) {
        let direction;
        if(xDelta === 1) direction = "east";
        if(xDelta === -1) direction = "west";
        if(yDelta === 1) direction = "south";
        if(yDelta === -1) direction = "north";

        let moveStatus = this.checkMove(xDelta, yDelta);

        switch(moveStatus) {
            case -1:
                console.warn(OUT_OF_BOUNDS.format(this.name, direction));
                return;

            case 0:
                if(xDelta !== 0 && yDelta !== 0) {
                    console.error(ERROR_LEAVE_PLACE.format(this.parentPlace));
                    return;
                }

                // only player can move out of their place
                if(this !== me) {
                    console.warn("{0} tried to exit {1}".format(this.name,
                        this.parentPlace.name));
                    return;
                }
                console.log("Player is exiting " + this.parentPlace.name);

                // remove me from the map
                this.getTile().removePlottable(this);

                // go the the current place's place (parent)
                this.xPos = this.parentPlace.xPos + xDelta;
                this.yPos = this.parentPlace.yPos + yDelta;
                this.parentPlace = this.parentPlace.parentPlace;
                break;

            case 1:
                // remove this from the map
                this.getTile().removePlottable(this);

                this.xPos += xDelta;
                this.yPos += yDelta;
                break;
            case 2:
                let place = this.parentPlace.getPlace(this.xPos + xDelta,
                                                        this.yPos + yDelta);

                if(this !== me) {
                    console.warn("{0} tried to enter {1}".format(this.name,
                        place.name));
                    return;
                }
                console.log("Player is entering " + place.name);

                this.parentPlace = place;
                this.xPos = 0;
                this.yPos = 0;
                break;
        }
        // add this to the map
        this.getTile().addPlottable(this);

        this.loseEnergy(this.energyCost("Move"));

        console.log("{0} moved {1} to ({2}, {3}) in {4}".format(this.tag,
            direction, this.xPos, this.yPos, this.parentPlace.tag));
    }

    /**
     * @return {int}    - -1 for invalid move
     *                    0 for exiting location
     *                    1 for normal move
     *                    2 for entering location
     */
    checkMove(xDelta, yDelta) {
        let x = this.xPos + xDelta;
        let y = this.yPos + yDelta;

        if(this.parentPlace.getPlace(x, y) != null)     return 2;
        else if(this.parentPlace.withinPlot(x, y))        return 1;
        else if(this.parentPlace.parentPlace != null)     return 0;
        else                                            return -1;
    }
}
