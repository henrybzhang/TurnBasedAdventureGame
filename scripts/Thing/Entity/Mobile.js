import {Entity} from "./Entity.js";

export class Mobile extends Entity {
    constructor(name, desc, place, xPos, yPos, level, baseStats, inventory) {
        super(name, desc, place, xPos, yPos, level, baseStats, inventory);
    }

    getTile() {
        return this.place.getTile(this.xPos, this.yPos);
    }

    move(xDelta, yDelta) {
        this.xPos += xDelta;
        this.yPos += yDelta;

        console.log(this.xPos + ", " + this.yPos);
    }
}