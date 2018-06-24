import {monsterList} from "../Data.js";
import {readFile} from "../Miscellaneous.js";
import Entity from "../Entity.js";
import Plottable from "./Plottable.js";

const MONSTER_LIST_FILE = "assets/json/monsterList.json";

const ERROR_OUT_OF_BOUNDS = "Invalid Move: Out of Bounds";
const ERROR_LEAVE_PLACE = "Invalid Move: No specific direction when exiting {0}";

export default class Mobile extends Plottable {
    constructor(name, desc, parentPlace, xPos, yPos, level, baseStats, inventory) {
        super(name, desc, parentPlace, xPos, yPos);

        this.entity = new Entity(level, baseStats, inventory);
    }

    // TODO: make movement update plot
    move(xDelta, yDelta) {
        let moveStatus = this.checkMove(xDelta, yDelta);

        switch(moveStatus) {
            case -1:
                console.error(ERROR_OUT_OF_BOUNDS);
                return;
            case 1:
                this.xPos += xDelta;
                this.yPos += yDelta;
                break;
            case 0:
                if(xDelta !== 0 && yDelta !== 0) {
                    console.error(ERROR_LEAVE_PLACE.format(this.parentPlace));
                    return;
                }

                // go the the current place's place (parent)
                this.xPos = this.parentPlace.xPos + xDelta;
                this.yPos = this.parentPlace.yPos + yDelta;
                this.parentPlace = this.parentPlace.parentPlace;
                break;
        }

        // check if this is on a place and enter it
        let newPlace = this.parentPlace.getPlace(this.xPos, this.yPos);
        if(newPlace != null) {
            this.parentPlace = newPlace;
            this.xPos = 0;
            this.yPos = 0;
        }

        console.log("{0}, {1} in {2}".format(this.xPos, this.yPos, this.parentPlace.name));
    }

    /**
     * @return {int}  - -1 for invalid move
     *                  0 for exiting location
     *                  1 for normal move
     */
    checkMove(xDelta, yDelta) {
        let x = this.xPos + xDelta;
        let y = this.yPos + yDelta;

        let max = this.parentPlace.size;

        if (x >= 0 && x < max && y >= 0 && y < max)      return 1;
        else if (this.parentPlace.parentPlace != null)   return 0;
        else                                             return -1;
    }

    clone() {
       return new Mobile(this.name, this.desc, this.parentPlace, this.xPos,
           this.yPos, this.entity.level, this.entity.baseStats, this.entity.inventory);
    }


    static createMonsters() {
        console.log("Creating Monsters");

        let monsterObject = JSON.parse(readFile(MONSTER_LIST_FILE));

        for(let monsterName in monsterObject) {
            let m = monsterObject[monsterName];
            monsterList[monsterName] = new Mobile(monsterName, m.desc, null,
                -1, -1, m.level, m.baseStats, m.inventory);
        }

        console.log(monsterList);
    }
}

Mobile.createMonsters();
