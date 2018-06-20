"use strict";

import {Plot} from './Thing/Place/Plot.js';
import {Default} from "./Event/Default.js";
import {Plottable} from "./Thing/Plottable.js";

let plot = readInMap("./assets/plot/csv/mainMap_Terrain.csv");
let player = new Plottable("ME");

function start() {
    createDisplay();
    let event = new Default(player.getTile(plot));

    updateDisplay(event);
}

function createDisplay() {
    let body = document.getElementsByTagName("body")[0];

    // contains the upper three divs: playerInfo, mainText, otherInfo
    let container = document.createElement("div");
    container.className = "container";

    let playerInfo = document.createElement("div");
    let otherInfo = document.createElement("div");
    playerInfo.id = "playerInfo";
    otherInfo.id = "otherInfo";

    let mainText = document.createElement("div");
    mainText.id = "main";

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

/**
 * @param event - A subclass of the base class Event
 */
function updateDisplay(event) {

    // update buttons
    let currentButtonSet = document.getElementsByTagName("button");
    for(let i = 0; i < event.buttonSet.length; i++) {
        currentButtonSet[i].innerHTML = event.buttonSet[i];
        currentButtonSet[i].addEventListener("click",
            function() { event.chooseEvent(event.buttonSet[i], player) });
    }

    // update mainText
    let mainText = document.getElementById("main");
    mainText.innerHTML = event.mainText;
}

// read in the map csv file
function readInMap(filePath) {
    let fileReader = new XMLHttpRequest();
    fileReader.open("GET", filePath, false);
    fileReader.send();
    return new Plot(fileReader.responseText)
}


start();