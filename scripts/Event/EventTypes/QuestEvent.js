import Template from './Template.js';

export default class QuestEvent extends Template {

    /**
     *
     * @param title
     * @param storyText
     * @param eventObject
     * @param eventJSON {Object} A JSON object of this event
     * @param quest {Quest} The quest this event is a part of
     */
    constructor(title, storyText, eventObject, eventJSON, quest) {
        super(title, storyText, eventObject);

        this.eventJSON = eventJSON;
        this.quest = quest;
    }

    sideEffects() {
        if(this.eventJSON.hasOwnProperty("nextChapter")) {
            console.log("Next Chapter for this quest is chosen " + this.eventJSON.nextChapter);
            this.quest.nextChapter = this.quest.story[this.eventJSON.nextChapter];

            this.quest.updatePlottable();
        }
    }

}