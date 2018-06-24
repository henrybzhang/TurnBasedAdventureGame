import {readFile} from "../../Miscellaneous.js";
import {placeList} from "../../Data.js";
import {monsterList} from "../../Data.js";
import {tileList} from "../../Data.js";
import Default from "../../Event/Default.js";
import Fight from "../../Event/Fight.js";

const TILE_TEXT_FILE = "assets/json/tileText.json";

const ENCOUNTER_CHANCE = [0, 20, 50];

export default class Tile {
    constructor(name, desc, dangerLevel) {
        this.name = name;
        this.desc = desc;
        this.dangerLevel = dangerLevel;
        this.myTiles = {
            name : tileList[this.name]
        };
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
        console.log("Random: " + random);
        console.log(this.dangerLevel);

        if(random < ENCOUNTER_CHANCE[this.dangerLevel]) {
            let monster = monsterList.randomMonster();
            return new Fight("Fight " + monster.name, monster.desc,
                this.getEvent(), monster);
        }

        return new Default(this);
    }

    static createTiles() {
        console.log("Creating Tiles");

        let tileObject = JSON.parse(readFile(TILE_TEXT_FILE));

        for(let tileName in tileObject) {
            let tile = tileObject[tileName];
            tileList[tileName] = new Tile(tileName, tile.desc, tile.dangerLevel);
        }

        console.log(tileList);
    }
}

Tile.createTiles();


