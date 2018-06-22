export class Event {
    constructor(title, mainText, buttonSet) {
        this.title = title;
        this.mainText = mainText;
        this.buttonSet = buttonSet;
    }

    buttonPress(command, player) {
        let newEvent = this.chooseNewEvent(command, player);

        if(newEvent == null) {
            console.log("Given a null event");
            return;
        }
        Event.updateDisplay(newEvent, player);
    }

    /**
     * @param event - A subclass of the base class Event
     * @param {Mobile} player - The player of the game
     */
    static updateDisplay(event, player) {

        // update buttons
        let currentButtonSet = document.getElementsByTagName("button");
        for(let i = 0; i < event.buttonSet.length; i++) {
            let clone = currentButtonSet[i].cloneNode();
            clone.innerHTML = event.buttonSet[i];
            clone.addEventListener("click",
                function() { event.buttonPress(event.buttonSet[i], player) });
            currentButtonSet[i].parentNode.replaceChild(clone, currentButtonSet[i]);
        }

        // update mainText
        let mainText = document.getElementById("mainText");
        mainText.textContent = event.mainText;


        // update otherInfo
        let newImage = document.getElementById("image");
        newImage.src = "assets/plot/images/main.png";
        newImage.style.top = (128 - player.yPos * 64) + "px";
        newImage.style.left = (128 - player.xPos * 64) + "px";
    }

    /**
     * @param {String} command - the text of the button the user clicks
     * @param {Mobile} player - the player of the game
     *
     * wrong warning message
     */
    chooseNewEvent(command, player) {
        throw new Error('You have to implement this abstract method');
    }
}