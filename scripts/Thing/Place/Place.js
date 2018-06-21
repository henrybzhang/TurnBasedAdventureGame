"use strict";

import {Plottable} from "../Plottable.js";
import {Tile} from "./Tile.js";
import {readFile} from "../../Miscellaneous.js";

export class Place extends Plottable {

    constructor(name, desc, place, xPos, yPos, size, hasEntry) {
        super(name, desc, place, xPos, yPos);

        this.size = size;
        this.hasEntry = hasEntry;

        this.createPlot();
    }

    createPlot() {
        let plotTiles = readFile(PLOT_CSV_FILE.format(this.name));

        let plotRows = plotTiles.split("\n");
        plotRows.pop();

        if(plotRows.length !== this.size) {
            console.error("Difference between csv and json for " + this.name);
            return;
        }

        // create a matrix for the plot
        this.plot = new Array(plotRows.length);
        for(let y = 0; y < plotRows.length; y++) {
            this.plot[y] = new Array(plotRows.length);

            let row = plotRows[y].split(",");
            for(let x = 0; x < row.length; x++) {

                // no tile in csv file == -1
                // city/town tile == -1
                if(row[x] === "-1" || row[x] === "113") {
                    continue;
                }

                let tile = Tile.tileList.find(t => t.name === row[x]);
                this.plot[y][x] = JSON.parse(JSON.stringify(tile));
            }
        }
    }

    getTile(xPos, yPos) {
        return this.plot[yPos][xPos];
    }

    static createPlaces() {
        console.log("Creating Places");

        let placeObject = JSON.parse(readFile(PLACE_LIST_FILE));

        // push main map onto list
        Place.placeList.push(new Place("main", "main", null, -1, -1, 32, false));

        for(let placeName in placeObject) {
            let p = placeObject[placeName];
            Place.placeList.push(
                new Place(placeName, p.desc, p.place,
                    p.xPos, p.yPos, p.size, p.hasEntry));
        }

        console.log(Place.placeList);
    }
}

// constants
const PLACE_LIST_FILE = "assets/json/placeList.json";
const PLOT_CSV_FILE = "assets/plot/csv/{0}_Bot.csv";

// static member
Place.placeList = [];


