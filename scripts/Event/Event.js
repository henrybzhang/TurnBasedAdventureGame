const PLOT_FILE = "assets/plot/images/{0}.png";

export default class Event {
    constructor(title, storyText, buttonSet, nextEvent, other) {
        this.title = title;
        this.storyText = storyText;
        this.buttonSet = buttonSet;

        this.nextEvent = nextEvent;
        this.other = other;
    }

    buttonPress(command, player) {
        let newEvent = this.chooseNewEvent(command, player);

        if(newEvent == null) {
            console.error("Given a null event to display");
            return;
        }
        Event.updateDisplay(newEvent, player);
    }

    /**
     * @param event - A subclass of the base class Event
     * @param player {Mobile} The player of the game
     */
    static updateDisplay(event, player) {

        // update buttons
        let $buttonSet = $("button");
        $buttonSet.hide();

        $buttonSet.each(function(index) {
            if(index === event.buttonSet.length) {
                return false;
            }

            let $this = $(this);
            $this.text(event.buttonSet[index]);
            $this.off("click");
            $this.click(function() {
                event.buttonPress(event.buttonSet[index], player);
            });
            $this.show();
        });


        // update storyText
        $("#storyText").text(event.storyText);


        // update otherInfo
        let newImage = $("#plot");
        newImage.attr("src", PLOT_FILE.format(player.parentPlace.name));
        newImage.css({
            top: (128 - player.yPos * 64),
            left: (128 - player.xPos * 64)
        });
    }

    /**
     * @param {String} command - the text of the button the user clicks
     * @param {Mobile} player - the player of the game
     *
     * Abstract method to be implemented by child classes
     */
    chooseNewEvent(command, player) {
        throw new Error('You have to implement this abstract method');
    }
}