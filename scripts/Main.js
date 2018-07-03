"use strict";

import Mobile from "./Thing/Mobile.js";
import Event, {me} from "./Event.js";
import './Initialize.js';

function start() {
    initialize();
    createDisplay();

    let event = me.getTile().getEvent();
    event.updateDisplay();
}

function initialize() {
    let startStats = [10, 10, 10, 10];
    Event.createMe(new Mobile("ME", "myDesc", "main", 0, 0, 1, startStats, null));
}

function createDisplay() {
    // contains the upper three divs: playerInfo, storyText, otherInfo
    $("<div>", {id: "mainContainer"}).appendTo("body");


    $("<div>", {id: "playerContainer"}).appendTo("#mainContainer");
    $("<p>", {id: "playerInfoText"}).appendTo("#playerContainer");


    $("<div>", {id: "storyContainer"}).appendTo("#mainContainer");
    $("<p>", {id: "storyText"}).appendTo("#storyContainer");


    $("<div>", {id: "otherContainer"}).appendTo("#mainContainer");
    $("<div>", {id: "plotContainer"}).appendTo("#otherContainer");
    $("<img>", {id: "plot"}).appendTo("#plotContainer");
    $("<img>", {id: "playerIcon"}).appendTo("#plotContainer");
    $("<div>", {id: "otherInfo"}).appendTo("#otherContainer");
    $("<p>", {id: "otherInfoText"}).appendTo("#otherInfo");


    // create the buttons for the game
    for (let i = 0; i < 6; i++) {
        $("<button>").appendTo("body");
    }
}

start();