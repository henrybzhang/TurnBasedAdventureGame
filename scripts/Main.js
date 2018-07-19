"use strict";

import {questList} from "./Data.js";
import {findObj} from "./Miscellaneous.js";
import './Initialize.js';
import Game from "./Game.js";

function start() {
    createDisplay();

    let event = findObj("Opening Scene", questList).nextChapter.rootEvent;
    new Game(event);
}

function createDisplay() {
    // contains the upper three divs: playerInfo, storyText, otherInfo
    $("<div>", {id: "mainContainer"}).appendTo("body");


    $("<div>", {id: "playerContainer", class: "sidebar"}).appendTo("#mainContainer");
    $("<p>", {id: "playerInfoText"}).appendTo("#playerContainer");


    $("<div>", {id: "storyContainer"}).appendTo("#mainContainer");
    $("<p>", {id: "storyText"}).appendTo("#storyContainer");


    $("<div>", {id: "otherContainer", class: "sidebar"}).appendTo("#mainContainer");
    $("<div>", {id: "plotContainer"}).appendTo("#otherContainer");
    $("<img>", {id: "plot"}).appendTo("#plotContainer");
    $("<img>", {id: "playerIcon"}).appendTo("#plotContainer");
    $("<div>", {id: "otherInfo"}).appendTo("#otherContainer");
    $("<p>", {id: "otherInfoText"}).appendTo("#otherInfo");

    $("<div>", {id: "buttonContainer"}).appendTo("body");
    $("<div>", {id: "playerInfoButtons"}).appendTo("#buttonContainer");
    $("<button>", {class: "playerInfoButton", text: "Inventory"}).appendTo("#playerInfoButtons");
    $("<button>", {class: "playerInfoButton", text: "Equipment"}).appendTo("#playerInfoButtons");

    $("<div>", {id: "playerActionButtons"}).appendTo("#buttonContainer");
    $("#playerActionButtons").css({
        width: ($("#storyContainer").width() + "px")
    });
    // create the buttons for the game
    for (let i = 0; i < 9; i++) {
        $("<button>", {class: "playerActionButton"}).appendTo("#playerActionButtons");
    }
}

start();