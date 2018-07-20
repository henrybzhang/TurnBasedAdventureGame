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

    /**
     * @param {String} command - the text of the button the user clicks
     * @returns {Event} The next event to be displayed
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
