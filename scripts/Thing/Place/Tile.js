import {readFile} from "../../Miscellaneous.js";

const TILE_TEXT_FILE = "assets/json/tileText.json";

export let tileList = {};

export class Tile {
    constructor(name, desc) {
        this.name = name;
        this.desc = desc;
        this.myTileList = {
            name : tileList[this.name]
        };
        this.onTileList = {};
    }

    /**
     * Gets called after this already has a tile
     * @param {String} tileName - the name of the tile to add to this
     */
    addTile(tileName) {
        let tile = tileList[tileName];
        this.name += "\\" + tile.name;
        this.desc += "\n\n" + tile.desc;

        this.myTileList[tileName] = tile;
    }

    addPlottable(plottable) {
        this.onTileList[plottable.name] = plottable;
    }

    static createTiles() {
        console.log("Creating Tiles");

        let tileObject = JSON.parse(readFile(TILE_TEXT_FILE));

        for(let tileName in tileObject) {
            let tile = tileObject[tileName];
            tileList[tileName] = new Tile(tileName, tile.desc);
        }

        console.log(tileList);
    }
}


