import {readFile} from "../../Miscellaneous.js";

export class Tile {
    constructor(name, desc) {
        this.name = name;
        this.desc = desc;
    }

    static createTiles() {
        console.log("Creating Tiles");

        let tileObject = JSON.parse(readFile(TILE_TEXT_FILE));

        for(let tileName in tileObject) {
            let tile = tileObject[tileName];
            Tile.tileList.push(new Tile(tileName, tile.desc));
        }

        console.log(Tile.tileList);
    }
}

const TILE_TEXT_FILE = "assets/json/tileText.json";

Tile.tileList = [];