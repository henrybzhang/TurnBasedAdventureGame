"use strict";

import {tileList} from "../../Data.js";
import {placeList} from "../../Data.js";
import {readFile} from "../../Miscellaneous.js";
import Plottable from "../Plottable.js";
import Tile from "./Tile.js";

// constants
const PLACE_LIST_FILE = "assets/json/placeList.json";
const PLOT_CSV_FILE = "assets/plot/csv/{0}_{1}.csv";
const LAYER_NAMES = ["Bot", "Top"];

export default class Place extends Plottable {

    constructor(name, desc, placeName, xPos, yPos, size, hasEntry) {
        super(name, desc, placeName, xPos, yPos);

        console.log("Creating {0}".format(this.name));

        this.size = size;
        this.hasEntry = hasEntry;

        this.createPlot();
    }

    createPlot() {
        for(let i = 0; i < LAYER_NAMES.length; i++) {
            let plotTiles = readFile(PLOT_CSV_FILE.format(this.name, LAYER_NAMES[i]));

            let plotRows = plotTiles.split("\n");
            plotRows.pop();

            if (plotRows.length !== this.size) {
                console.error("Difference between csv and json for " + this.name);
                return;
            }

            // create a matrix for the plot
            if(this.plot == null) {
                this.plot = new Array(plotRows.length);
            }
            for (let y = 0; y < plotRows.length; y++) {
                if(this.plot[y] == null) {
                    this.plot[y] = new Array(plotRows.length);
                }

                let row = plotRows[y].split(",");
                for (let x = 0; x < row.length; x++) {

                    // no tile in csv file == -1
                    // city/town tile == 113
                    if (row[x] === "-1" || row[x] === "113") {
                        continue;
                    }

                    if(this.plot[y][x] == null) {
                        let tileToCopy = tileList[row[x]];
                        this.plot[y][x] = new Tile(tileToCopy.name,
                                        tileToCopy.desc, tileToCopy.dangerLevel);
                        continue;
                    }
                    this.plot[y][x].addTile(row[x]);
                }
            }
        }
        console.log("Created plot for {0} with size {1}\n\n".format(this.name, this.size));
    }

    /**
     * Adds the plottable to its position in the plot
     * @param {Plottable} plottable
     */
    addToPlot(plottable) {
         this.plot[plottable.yPos][plottable.xPos].addPlottable(plottable);
    }

    getPlace(x, y) {
        return this.plot[y][x].getPlace();
    }

    /**
     * @returns {Tile} The list of tiles at this coordinate in the place
     */
    getTile(xPos, yPos) {
        console.log(this.plot[yPos][xPos].onTileList);
        return this.plot[yPos][xPos];
    }

    static createPlaces() {
        console.log("Creating Places");

        let placeObject = JSON.parse(readFile(PLACE_LIST_FILE));

        // push main map onto list
        placeList["main"] = new Place("main", "main", null, -1, -1, 32, false);

        for(let placeName in placeObject) {
            let p = placeObject[placeName];
            placeList[placeName] =
                new Place(placeName, p.desc, p.parentPlace,
                    p.xPos, p.yPos, p.size, p.hasEntry);
        }

        console.log(placeList);
    }
}

Place.createPlaces();

