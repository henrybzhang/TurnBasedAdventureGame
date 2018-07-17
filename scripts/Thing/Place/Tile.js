import {placeList, totalList, me} from "../../Data.js";
import Default from "../../Event/EventTypes/Default.js";
import Template from "../../Event/EventTypes/Template.js"
import Thing from "../../Thing.js";
import Entity from "../Entity.js";
import FightEvent from "../../Event/EventTypes/FightEvent.js";

const PLOTTABLE_REMOVE_ERROR = "Trying to remove {0}#{1} when it isn't on the " +
    "tile in the first place";

export default class Tile extends Thing {
    constructor(name, desc, dangerLevel) {
        super(name, desc);
        this.dangerLevel = dangerLevel;

        // keys are id numbers
        this.onTileList = {};

        this.myTiles = {};
        this.myTiles[this.id] = this;
    }

    /**
     * Gets called after this already has a tile
     * @param tile {Tile} The tile to add to this
     */
    addTile(tile) {
        this.name += "\\" + tile.name;
        this.desc += "\n\n" + tile.desc;

        if(this.dangerLevel < tile.dangerLevel) {
            this.dangerLevel = tile.dangerLevel;
        }

        this.myTiles[tile.id] = tile;
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

    hasTile(tileID) {
        return (tileID in this.myTiles);
    }

    getEnemy(selfID) {
        for(let plottableID in this.onTileList) {
            if(selfID !== plottableID &&
                this.onTileList[plottableID] instanceof Entity) {
                return this.onTileList[plottableID];
            }
        }
        return null;
    }

    interact() {
        // keys are id numbers
        let keys = Object.keys(this.onTileList);

        let eventObject = {};
        let desc = "";
        for(let key of keys) {
            eventObject[totalList[key].name] = this.onTileList[key].interact();
            desc += this.onTileList[key].desc = '\n';
        }
        eventObject["Go Back"] = new Default(this);

        return new Template("Interaction on " + this.name, desc, eventObject);
    }

    getPlace() {
        for(let plottableID in this.onTileList) {
            if(placeList[plottableID] != null) {
                return placeList[plottableID];
            }
        }
        return null;
    }

    getEvent() {
        let enemy = this.getEnemy(me.id);
        if(enemy !== null) {
            return new FightEvent("Fight with " + enemy.id, enemy.desc, null, enemy);
        }

        return new Default(this);
    }
}