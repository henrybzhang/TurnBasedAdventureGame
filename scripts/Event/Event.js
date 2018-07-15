import {me} from '../Data.js';

const PLOT_FILE = "assets/plot/images/{0}.png";

export default class Event {

    /**
     * @param title {String} The title of this
     * @param storyText {String} The text of this to show
     * @param buttonSet {String[]} The texts of the buttons to be used
     * @param nextEvent {Event] The next event to use
     * @param other {Plottable} Other plottables involved with this event
     */
    constructor(title, storyText, buttonSet, nextEvent, other) {
        this.title = title;
        this.storyText = storyText;
        this.buttonSet = buttonSet;

        this.nextEvent = nextEvent;
        this.other = other;
    }

    buttonPress(command) {
        this.sideEffects();

        let newEvent = this.chooseNewEvent(command);
        console.log(me.inventory);

        if(newEvent == null) {
            if(newEvent === undefined) {
                console.error("Given a undefined event to display");
            }
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
        $otherInfoText.text("");
        if(this.other != null) {
            $otherInfoText.text(this.other.info());
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
    sideEffects() {
        console.log("No side effects");
    }

    canDo() {
        return true;
    }
}
