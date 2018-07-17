import Chapter from '../Chapter.js';
import Thing from '../Thing.js';
import {totalList} from '../Data.js';

export default class Quest extends Thing {

    /**
     * @param name
     * @param desc
     * @param story {Object} Holds the storyline of the quest
     * @param startChapter {String} The name of the starting event sequence
     */
    constructor(name, desc, story, startChapter) {
        super(name, desc);

        this.story = {};
        for(let chapterName in story) {
            this.story[chapterName] = new Chapter(chapterName,
                story[chapterName], this);
        }

        this.nextChapter = this.story[startChapter];
        totalList[this.nextChapter.triggerName].addQuest(this);
    }

    /**
     * Give the plottable for the nextChapter this quest so it can be triggered
     */
    updateChapter(chapterName) {

        // remove the quest from the trigger to move on to the next chapter
        let oldTrigger = this.nextChapter.triggerName;
        if(oldTrigger === "N/A") {
            return;
        }
        delete totalList[oldTrigger].quests[this.name];

        // this quest is finished
        if(chapterName === null) {
            console.log(this.name + " is finished");
            return;
        }

        let newTrigger = this.story[chapterName].triggerName;

        // totalList does not include this trigger
        if(!totalList.hasOwnProperty(newTrigger)) {
            console.error(newTrigger + " is not a valid plottable");
            return;
        }

        this.nextChapter = this.story[chapterName];
        totalList[newTrigger].addQuest(this);
    }
}