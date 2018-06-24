"use strict";

// Place needs to be first because it is circular dependent on Plottable
import Mobile from "./Thing/Mobile.js";
import Default from "./Event/Default.js";
import Event from "./Event/Event.js";

function start() {
    createDisplay();

    let startStats = {
        "hp": 10,
        "energy": 10,
        "agility": 10,
        "strength": 10
    };
    let player = new Mobile("ME", "myDesc", "main", 0, 0, 1, startStats, null);

    let event = new Default(player.getTile());
    Event.updateDisplay(event, player);
}

function createDisplay() {
    // contains the upper three divs: playerInfo, storyText, otherInfo
    $("<div>", {id: "mainContainer"}).appendTo("body");


    $("<div>", {id: "playerInfo"}).appendTo("#mainContainer");


    $("<div>", {id: "storyContainer"}).appendTo("#mainContainer");
    $("<p>", {id: "storyText"}).appendTo("#storyContainer");


    $("<div>", {id: "otherInfo"}).appendTo("#mainContainer");
    $("<div>", {id: "plotContainer"}).appendTo("#otherInfo");
    $("<img>", {id: "plot"}).appendTo("#plotContainer");
    $("<img>", {id: "playerIcon"}).appendTo("#plotContainer");


    // create the buttons for the game
    for (let i = 0; i < 6; i++) {
        $("<button>").appendTo("body");
    }
}

start();