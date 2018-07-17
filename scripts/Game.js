"use strict";

import {activeMonsters} from "./Data.js";
import Place from './Thing/Place/Place.js';
import Battle from "./Battle.js";

const DEAD_MONSTER = "{0}#{1} has died in a battle against {2}#{3}";

// 24 hours in minutes
const TIME_PERIOD = 1440;

export let gameTime = TIME_PERIOD;
export let dayCount;

export function progressTime(amount) {
    gameTime += amount;

    timeEvent();

    // end of the day
    if(gameTime >= TIME_PERIOD) {
        console.log("It's a new day");
        dayCount++;
        gameTime -= TIME_PERIOD;

        // Randomly create monsters that can move around
        Place.birthMonsters();
    }

    console.log("Active Monster List");
    console.log(activeMonsters);
    console.log('-----------------------------------------------');
}

function timeEvent() {
    for(let monsterID in activeMonsters) {
        let monster = activeMonsters[monsterID];
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
    }

    checkForConflict();
}

function checkForConflict() {
    for(let monsterID in activeMonsters) {
        let monster = activeMonsters[monsterID];
        let enemy = monster.getTile().getEnemy(monsterID);
        if(enemy !== null) {
            let participants = [monster, enemy];
            new Battle(participants, false, null);

            for(let i = 0; i < participants.length; i++) {
                let self = participants[i];
                if(self.hp() === 0) {
                    let enemy = participants[1 - i]; // only two fighters
                    console.log(DEAD_MONSTER.format(self.name,
                        self.id, enemy.name, enemy.id));
                    self.getTile().removePlottable(self);
                    delete activeMonsters[self.id];
                }
            }
        }
    }
}

