import Chapter from '../Event/Chapter.js';
import Thing from './Thing.js';
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
            let e = story[chapterName];
            this.story[chapterName] = new Chapter(chapterName, e["triggerName"],
                e["triggerEvent"], e["timeLength"], e["gain"], e["lose"],
                e["eventSeries"], this);
        }

        this.nextChapter = this.story[startChapter];
        this.plottableName = this.nextChapter.triggerName;

        this.updatePlottable();
    }

    updatePlottable() {
        delete totalList[this.plottableName].quests[this.name];
        this.plottableName = this.nextChapter.triggerName;
        totalList[this.plottableName].addQuest(this);
    }
}