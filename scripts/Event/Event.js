import {me, activeMonsters} from '../Data.js';
import Place from '../Thing/Place/Place.js';
import {placeList} from "../Data.js";

const PLOT_FILE = "assets/plot/images/{0}.png";

// 24 hours in minutes
const TIME_PERIOD = 1440;

export default class Event {

    /**
     * @param title {String} The title of this
     * @param storyText {String} The text of this to show
     * @param buttonSet {String[]} The texts of the buttons to be used
     * @param nextEvent {Event} The next event to use
     * @param other {Plottable} Other plottables involved with this event
     */
    constructor(title, storyText, buttonSet, nextEvent, other) {
        this.title = title;
        this.storyText = storyText;
        this.buttonSet = buttonSet;

        this.nextEvent = nextEvent;
        this.other = other;

        this.timeTaken = 0;
    }

    buttonPress(command) {
        let newEvent = this.chooseNewEvent(command);
        this.sideEffect(command, newEvent);
        Event.gameTime += this.timeTaken;
        Event.timeEvent();

        if(newEvent == null) {
            if(newEvent === undefined) {
                console.error("Given a undefined event to display");
            }
            console.log("Given a null event to display");
            newEvent = me.getTile().getEvent();
        }
        newEvent.updateDisplay();
    }

    updateDisplay() {
        let self = this;

        // update playerInfo
        $("#playerInfoText").text(me.info());


        // update storyText
        $("#storyText").text(self.storyText);


        // update otherInfo
        let newImage = $("#plot");
        newImage.attr("src", PLOT_FILE.format(me.parentPlace.name));
        newImage.css({
            top: (128 - me.yPos * 64),
            left: (128 - me.xPos * 64)
        });

        let $otherInfoText = $("#otherInfoText");
        $otherInfoText.text("Time: {0}\n\n".format(Event.gameTime));
        if(this.other != null) {
            $otherInfoText.append(this.other.info());
        }


        // update buttons
        let $buttonSet = $("button");
        $buttonSet.hide();
        $buttonSet.prop("disabled", false);

        $buttonSet.each(function(index) {
            if(index === self.buttonSet.length) {
                return false;
            }

            let $this = $(this);
            $this.text(self.buttonSet[index]);
            $this.off("click");
            $this.click(function() {
                self.buttonPress(self.buttonSet[index], me);
            });
            $this.show();

            if(!self.canDo(self.buttonSet[index], me)) {
                $this.prop("disabled", true);
            }
        });
    }

    /**
     * @param {String} command - the text of the button the user clicks
     *
     * @abstract
     */
    chooseNewEvent(command) {
        console.error('You have to implement this abstract chooseNewEvent method');
    }

    /**
     * Performs side effects when this event is triggered
     */
    sideEffect() {
        console.log("No side effects");
    }

    canDo() {
        return true;
    }

    static timeEvent() {
        let x = [];
        let y = [];

        for(let monster of activeMonsters) {
            let randomMove = Math.floor(Math.random() * 4);
            switch(randomMove) {
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
            }
            console.log("({0}, {1})".format(monster.xPos, monster.yPos));
            x.push(monster.xPos);
            y.push(monster.yPos);
            console.log('------------------');
        }

        // End of each day
        if(Event.gameTime >= TIME_PERIOD) {
            console.log("It's a new day");
            Event.gameTime -= TIME_PERIOD;
            Event.dayCount++;

            // Randomly create monsters that can move around
            Place.birthMonsters();
        }

        console.log("Active Monster List");
        console.log(activeMonsters);
        console.log(x);
        console.log(y);

        if(x.length === activeMonsters.length) {
            for (let i = 0; i < activeMonsters.length; i++) {
                console.log("({0}, {1})".format(activeMonsters[i].xPos,
                    activeMonsters[i].yPos));
                if (x[i] !== activeMonsters[i].xPos ||
                    y[i] !== activeMonsters[i].yPos) {
                    console.error(activeMonsters[i]);
                    console.error("Correct: ({0}, {1})".format(x[i], y[i]));
                    console.error("Wrong: ({0}, {1})".format(activeMonsters[i].xPos, activeMonsters[i].yPos));
                }
            }
        }
        console.log('-----------------------------------------------');

        // console.log("\nOn Main");
        // console.log(placeList["main"].getAllPlottables());
    }
}

Event.gameTime = TIME_PERIOD;
Event.dayCount = 0;
