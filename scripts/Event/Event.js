export class Event {
    constructor(title, mainText, buttonSet) {
        this.title = title;
        this.mainText = mainText;
        this.buttonSet = buttonSet;
    }

    /**
     * @param {String} command - the text of the button the user clicks
     * @param {Plottable} player - the player of the game
     *
     * wrong warning message
     */
    chooseEvent(command, player) {
        throw new Error('You have to implement this abstract method');
    }
}