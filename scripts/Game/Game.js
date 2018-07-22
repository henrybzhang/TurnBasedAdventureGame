"use strict";

import {activeMonsters, me} from "../Data.js";
import Inventory from "../EventTypes/Inventory.js";
import Gear from "../EventTypes/Gear.js";
import Place from '../Thing/Plottables/Place.js';
import Battle from "./Battle.js";
import FightEvent from "../EventTypes/FightEvent.js";
import Trade from "../EventTypes/Trade.js";

const PLOT_FILE = "assets/plot/images/{0}.png";

export default class Game {

    constructor(event) {
        this.gameTime = new Time();
        this.currentEvent = null;

        this.initialize();
        this.updateDisplay(event);
    }

    /**
     * For finishing up initializations dependent on a Game instance
     */
    initialize() {
        console.group("Initializing this Game instance");

        let self = this;

        $("body").empty();

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


        $("<div>", {id: "playerInfoButtons"}).appendTo("#playerContainer");
        $("<button>", {
            class: "playerInfoButton",
            id: "Inventory",
            text: "Inventory"
        }).appendTo("#playerInfoButtons");
        $("<button>", {
            class: "playerInfoButton",
            id: "Gear",
            text: "Gear"
        }).appendTo("#playerInfoButtons");
        $(".playerInfoButton").each(function () {
            let $this = $(this);
            $this.click(function () {
                self.buttonPress($this.text());
            });
        });

        $("<table>", {id: "playerActionButtons"}).appendTo("body");
        $("#playerActionButtons").css({
            width: ($("#storyContainer").width() + "px")
        });
        // create the buttons for the game
        for (let i = 0; i < 9; i++) {
            $("<button>", {class: "playerActionButton"}).appendTo("#playerActionButtons");
        }


        Place.birthMonsters();

        console.groupEnd();
    }

    buttonPress(command) {
        let newEvent = null;

        // no time taken for these commands
        // these events can be activated anytime
        switch (command) {
            case "Inventory":
                newEvent = new Inventory(me, this.currentEvent);
                break;
            case "Gear":
                newEvent = new Gear(this.currentEvent);
                break;
        }

        if (newEvent === null) {
            newEvent = this.currentEvent.chooseNewEvent(command);
            this.currentEvent.sideEffect(command, newEvent);

            // Game events independent of player
            this.progressTime(this.currentEvent.timeTaken);

            if (newEvent === null) {
                if (newEvent === undefined) {
                    console.error("Given a undefined event to display");
                }
                newEvent = me.getTile().getEvent();
            }
        }

        this.updateDisplay(newEvent)
    }

    /**
     * @param event {Event} The new event to be displayed
     */
    updateDisplay(event) {
        console.log(event.title);
        this.currentEvent = event;

        let self = this;

        // update playerInfo
        $("#playerInfoText").text(me.info());


        // update storyText
        $("#storyText").text(event.storyText);


        // update otherInfo
        let newImage = $("#plot");
        newImage.attr("src", PLOT_FILE.format(me.parentPlace.name));
        newImage.css({
            top: (128 - me.yPos * 64),
            left: (128 - me.xPos * 64)
        });

        let $otherInfoText = $("#otherInfoText");
        $otherInfoText.text(this.gameTime.formatted());
        if (event.other != null) {
            $otherInfoText.append(event.other.name);
            if(event instanceof FightEvent) {
                $otherInfoText.append(event.fightInfo());
            }
        }


        // update buttons
        let $actionButtonSet = $(".playerActionButton");
        $actionButtonSet.prop("disabled", true);
        $actionButtonSet.text("");

        $actionButtonSet.each(function (index) {
            if (index === event.buttonSet.length) {
                return false;
            }

            let $this = $(this);

            $this.text(event.buttonSet[index]);
            $this.off("click"); // gets rid of all listeners
            $this.click(function () {
                self.buttonPress(event.buttonSet[index]);
            });

            if ($this.text() && event.canDo(event.buttonSet[index], me)) {
                $this.prop("disabled", false);
            }
        });

        let $Inventory = $("#Inventory");
        $Inventory.prop("disabled", false);
        if(event instanceof Inventory && event.self === me &&
            !(event.nextEvent instanceof Trade)) {
            $Inventory.prop("disabled", true);
        }

        let $Gear = $("#Gear");
        $Gear.prop("disabled", false);
        if(event instanceof Gear) {
            $Gear.prop("disabled", true);
        }
    }

    progressTime(amount) {
        if(amount === 0) {
            return;
        }

        Game.timeEvent();

        this.gameTime.addTime(amount);

        // end of the day
        if (this.gameTime.newDay === true) {
            console.log("It's a new day");

            // Randomly create monsters that can move around
            Place.birthMonsters();
        }

        console.log("Active Monster List");
        console.log(activeMonsters);
        console.log("Number of monsters: " + Object.keys(activeMonsters).length);
        console.log('--------------------------------------------------------');
    }

    static timeEvent() {
        // move all the monsters
        for (let monsterID in activeMonsters) {
            let monster = activeMonsters[monsterID];
            if(monster.fatigue() < 0.3 || monster.vitality() < 0.5) {
                monster.rest();
                continue;
            }
            let randomMove = Math.floor(Math.random() * 5);
            switch (randomMove) {
                case 0:
                    monster.move(0, -1);
                    break;
                case 1:
                    monster.move(0, 1);
                    break;
                case 2:
                    monster.move(1, 0);
                    break;
                case 3:
                    monster.move(-1, 0);
                    break;
                case 4:
                    monster.rest();
                    break;
            }
        }

        // if 2+ monsters occupy the same square, make them fight
        Game.checkForConflict();
    }

    static checkForConflict() {
        for (let monsterID in activeMonsters) {
            let monster = activeMonsters[monsterID];

            // fight with enemies on the same tile
            let enemies = monster.getTile().getEnemies(monsterID);
            if (enemies.length !== 0) {
                console.group("Battle");

                let participants = enemies.concat([monster]);
                let battle = new Battle(participants, null);

                if(battle.fighters.length !== 1 && battle.actionOccurred === true) {
                    console.error("Battle ended with multiple live fighters");
                    continue;
                }

                for(let fighter of battle.fighters) {
                    fighter.entity.gainXP(battle.totalXP);
                }

                console.groupEnd();
            }
        } // end of activeMonsters loop
    }
}

const TIME_FORMAT = "Day {0}, {1}:{2}\n";

class Time {
    constructor() {
        this.minutes = 0;
        this.hours = 0;
        this.days = 1;
        this.newHour = false;
        this.newDay = false;
    }

    /**
     * @param time {int} Time in minutes to add
     */
    addTime(time) {
        this.minutes += time;
        this.newHour = false;
        if(this.minutes >= 60) {
            this.hours++;
            this.minutes -= 60;
            this.newHour = true;
        }

        this.newDay = false;
        if(this.hours >= 24) {
            this.days++;
            this.hours -= 24;
            this.newDay = true;
        }
    }

    formatted() {
        return TIME_FORMAT.format(this.days, this.hours, this.minutes);
    }
}