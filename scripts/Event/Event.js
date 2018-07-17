import {me} from '../Data.js';
import {progressTime, gameTime} from "../Game.js";

const PLOT_FILE = "assets/plot/images/{0}.png";

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
        progressTime(this.timeTaken);

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
        $otherInfoText.text("Time: {0}\n\n".format(gameTime));
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
}
