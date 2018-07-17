"use strict";

import './Initialize.js';
import {questList} from "./Data.js";
import {findObj} from "./Miscellaneous.js";

function start() {
    createDisplay();

    let event = findObj("Opening Scene", questList).nextChapter.rootEvent;
    event.updateDisplay();
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