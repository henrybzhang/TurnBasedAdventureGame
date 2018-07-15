import {placeList, monsterList, tileList} from "../../Data.js";
import Default from "../../Event/EventTypes/Default.js";
import Fight from "../../Event/EventTypes/Fight.js";
import Template from "../../Event/EventTypes/Template.js"
import Thing from "../Thing.js";


const ENCOUNTER_CHANCE = [0, 20, 50];

export default class Tile extends Thing {
    constructor(name, desc, dangerLevel) {
        super(name, desc);
        this.dangerLevel = dangerLevel;

        this.myTiles = {};

        this.onTileList = {};
    }

    /**
     * Gets called after this already has a tile
     * @param tileName {String} the name of the tile to add to this
     */
    addTile(tileName) {
        let tile = tileList[tileName];
        this.name += "\\" + tile.name;
        this.desc += "\n\n" + tile.desc;

        this.myTiles[tileName] = tile;
    }

    addPlottable(plottable) {
        this.onTileList[plottable.name] = plottable;
    }

    hasTile(tileName) {
        return (tileName in this.myTiles);
    }

    interact() {
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
            // if(plottable instanceof Place) {
            //     return true;
            // }
            if(placeList[plottableName] != null) {
                return placeList[plottableName];
            }
        }
        return null;
    }

    getEvent() {
        // get number between 0 and 99
        let random = Math.floor(Math.random() * 100);

        if(random < ENCOUNTER_CHANCE[this.dangerLevel]) {
            let monster = monsterList.randomMonster().clone();
            console.log("Fighting " + monster.name);
            return new Fight("Fight " + monster.name, monster.desc,
                this.getEvent(), monster);
        }

        return new Default(this);
    }
}