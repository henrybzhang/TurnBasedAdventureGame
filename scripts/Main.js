"use strict";

import {Default} from "./Event/Default.js";
import {Event} from "./Event/Event.js";
import {Mobile} from "./Thing/Entity/Mobile.js";
import {Place} from "./Thing/Place/Place.js";
import {Tile} from "./Thing/Place/Tile.js";

function start() {
    initialize();
    createDisplay();

    let player = new Mobile("ME", "myDesc", Place.placeList.find(p => p.name === "main"),
        0, 0, 1, [10, 10, 10, 10], null);

    let event = new Default(player.getTile());
    Event.updateDisplay(event, player);
}

function initialize() {
    Tile.createTiles();
    Place.createPlaces();
}

function createDisplay() {
    let body = document.getElementsByTagName("body")[0];

    // contains the upper three divs: playerInfo, mainText, otherInfo
    let container = document.createElement("div");
    container.className = "container";


    let playerInfo = document.createElement("div");
    playerInfo.id = "playerInfo";


    let otherInfo = document.createElement("div");
    otherInfo.id = "otherInfo";

    let plotContainer = document.createElement("div");
    plotContainer.id = "plotContainer";
    let plot = document.createElement("img");
    plot.id = "image";
    let playerIcon = document.createElement("img");
    playerIcon.id = "playerIcon";
    playerIcon.src = "assets/playerIcon.jpeg";
    plotContainer.appendChild(plot);
    plotContainer.appendChild(playerIcon);
    otherInfo.appendChild(plotContainer);


    let mainText = document.createElement("div");
    mainText.id = "main";
    mainText.style.width = (body.clientWidth - 640) + "px";

    container.appendChild(playerInfo);
    container.appendChild(mainText);
    container.appendChild(otherInfo);
    body.appendChild(container);


    // create the buttons for the game
    for (let i = 0; i < 6; i++) {
        let button = document.createElement("button");
        body.appendChild(button);
    }
}

start();