import {Tile} from "./Tile.js";

export class Plot {

    // variables:
    // plot -- 2D Matrix holding the plot of the current location

    constructor(plotText) {
        let plotRows = plotText.split("\n");
        plotRows.pop();

        // create a matrix for the plot
        this.plot = new Array(plotRows.length);
        for(let y = 0; y < plotRows.length; y++) {
            this.plot[y] = new Array(plotRows.length);

            let row = plotRows[y].split(",");
            for(let x = 0; x < row.length; x++) {
               this.plot[y][x] = new Tile(row[x]);
            }
        }
    }

    getTile(xPos, yPos) {
        return this.plot[yPos][xPos];
    }
    
}