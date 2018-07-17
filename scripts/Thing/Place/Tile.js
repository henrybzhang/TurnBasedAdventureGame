import {placeList, tileList} from "../../Data.js";
import Default from "../../Event/EventTypes/Default.js";
import Template from "../../Event/EventTypes/Template.js"
import Thing from "../../Thing.js";

const PLOTTABLE_REMOVE_ERROR = "Trying to remove {0}#{1} when it isn't on the " +
    "tile in the first place";

export default class Tile extends Thing {
    constructor(name, desc, dangerLevel) {
        super(name, desc);
        this.dangerLevel = dangerLevel;

        // keys are id numbers
        this.onTileList = {};

        this.myTiles = {};
        this.myTiles[name] = this;
    }

    /**
     * Gets called after this already has a tile
     * @param tileName {String} the name of the tile to add to this
     */
    addTile(tileName) {
        let tile = tileList[tileName];
        this.name += "\\" + tile.name;
        this.desc += "\n\n" + tile.desc;

        if(this.dangerLevel < tile.dangerLevel) {
            this.dangerLevel = tile.dangerLevel;
        }

        this.myTiles[tileName] = tile;
    }

    addPlottable(plottable) {
        this.onTileList[plottable.id] = plottable;
    }

    removePlottable(plottable) {
        if(!this.onTileList.hasOwnProperty(plottable.id)) {
            console.error(PLOTTABLE_REMOVE_ERROR.format(plottable.name, plottable.id));
            console.error("({0}, {1})".format(plottable.xPos, plottable.yPos));
        }
        delete this.onTileList[plottable.id];
    }

    hasTile(tileName) {
        return (tileName in this.myTiles);
    }

    interact() {
        // keys are id numbers
        let keys = Object.keys(this.onTileList);

        if(keys.length === 1) {
            return this.onTileList[keys[0]].interact();
        }

        let eventObject = {};
        let desc = "";
        for(let key in keys) {
            eventObject[key] = this.onTileList[key].interact();
            desc += this.onTileList[key].desc = '\n';
        }
        eventObject["Go Back"] = new Default(this);

        return new Template("Interaction on " + this.name, desc, eventObject);
    }

    getPlace() {
        for(let plottableName in this.onTileList) {
            if(placeList[plottableName] != null) {
                return placeList[plottableName];
            }
        }
        return null;
    }

    getEvent() {
        // // get number between 0 and 99
        // let random = Math.floor(Math.random() * 100);
        //
        // if(random < BIRTH_CHANCE[this.dangerLevel]) {
        //     let monster = monsterList.randomMonster().clone();
        //     console.log("Fighting " + monster.name);
        //     return new FightEvent("FightEvent " + monster.name, monster.desc,
        //         this.getEvent(), monster);
        // }

        return new Default(this);
    }
}