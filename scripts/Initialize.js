import * as Data from './Data.js';
import {readFile, findObj} from "./Miscellaneous.js";

import Thing from './Thing.js';
import Item, {itemTypeEnum} from './Thing/Item.js';
import Tool from './Thing/ItemTypes/Tool.js';
import Clothing from './Thing/ItemTypes/Clothing.js';
import Consumable from './Thing/ItemTypes/Consumable.js';

// Place needs to be imported before Tile
import Place from './Thing/Place/Place.js';
import Tile from './Thing/Place/Tile.js';
import Entity from './Thing/Entity.js';
import Quest from './Thing/Quest.js';

const TILE_TEXT_FILE = "assets/json/tileText.json";
const PLACE_LIST_FILE = "assets/json/placeList.json";
const ITEM_LIST_FILE = "assets/json/itemList.json";
const MONSTER_LIST_FILE = "assets/json/monsterList.json";
const NPC_LIST_FILE = "assets/json/npcList.json";
const QUEST_LIST_FILE = "assets/json/questList.json";

const ERROR_NO_LOCATION_GIVEN = "No location given to place npc: {0}";

function createTiles() {
    console.log("Creating Tiles");

    let tileObject = JSON.parse(readFile(TILE_TEXT_FILE));

    for(let tileName in tileObject) {
        let tile = tileObject[tileName];
        Data.tileList[Thing.id] = new Tile(tileName, tile.desc, tile.dangerLevel);
    }

    Object.assign(Data.totalList, Data.tileList);

    console.log(Data.tileList);
    console.log('\n');
}

function createPlaces() {
    console.log("Creating Places");

    let placeObject = JSON.parse(readFile(PLACE_LIST_FILE));

    // push main map onto list
    Data.placeList[Thing.id] = new Place("main", "main", null, -1, -1, 32, false);

    for(let placeName in placeObject) {
        let p = placeObject[placeName];
        Data.placeList[Thing.id] =
            new Place(placeName, p.desc, findObj(p.parentPlace, Data.placeList),
                p.xPos, p.yPos, p.size, p.hasEntry);
    }

    Object.assign(Data.totalList, Data.placeList);

    console.log(Data.placeList);
    console.log('\n');
}

function createItems() {
    console.log("Creating Items");

    let itemObject = JSON.parse(readFile(ITEM_LIST_FILE));

    for(let itemName in itemObject) {
        let item = itemObject[itemName];
        let itemType = itemTypeEnum[item.type];
        switch(itemType) {
            case 1:
                Data.itemList[Thing.id] = new Item(itemName, item.desc, item.rarity,
                    item.type, item.value);
                break;
            case 2:
                Data.itemList[Thing.id] = new Tool(itemName, item.desc, item.rarity,
                    item.type, item.value, item.strength);
                break;
            case 3:
                Data.itemList[Thing.id] = new Clothing(itemName, item.desc, item.rarity,
                    item.type, item.value, item.resistance);
                break;
            case 4:
                Data.itemList[Thing.id] = new Consumable(itemName, item.desc, item.rarity,
                    item.type, item.value, item.strength);
                break;
            default:
                console.error("Unknown type: {0}".format(item.type));
        }
    }

    Object.assign(Data.totalList, Data.itemList);

    console.log(Data.itemList);
    console.log('\n');
}

function createMonsters() {
    console.log("Creating Monsters");

    let monsterObject = JSON.parse(readFile(MONSTER_LIST_FILE));

    for(let monsterName in monsterObject) {
        let m = monsterObject[monsterName];
        let inventory = {};
        for(let itemName in m.inventory) {
            let item = findObj(itemName, Data.itemList);
            inventory[item.id] = m.inventory[itemName];
        }

        Data.monsterList[Thing.id] = new Entity(monsterName, m.desc,
            findObj("main", Data.placeList), -1, -1, m.level, m.baseStats, inventory);
    }

    Object.assign(Data.totalList, Data.monsterList);

    console.log(Data.monsterList);
    console.log('\n');
}

function createNPCs() {
    console.log("Creating NPCs");

    let startStats = [10, 30, 10, 10];
    Data.npcList[Thing.id] = Data.createMe(new Entity("ME", "myDesc",
        findObj("main", Data.placeList), 0, 0, 1, startStats, {}));

    let npcObject = JSON.parse(readFile(NPC_LIST_FILE));

    for(let npcName in npcObject) {
        let npc = npcObject[npcName];
        let parentPlace = findObj(npc.parentPlace, Data.placeList);
        let inventory = {};
        for(let itemName in npc.inventory) {
            let item = findObj(itemName, Data.itemList);
            inventory[item.id] = npc.inventory[itemName];
        }

        let xPos = -1;
        let yPos = -1;
        if("squareName" in npc) {
            let place = findObj(npc.squareName, Data.placeList);
            xPos = place.xPos + npc["xDelta"];
            yPos = place.yPos + npc["yDelta"];
        } else if("squareType" in npc) {
            let tile = npc.squareType;
            let coordinates = parentPlace.getTileCoordinates(tile);
            xPos = coordinates[0];
            yPos = coordinates[1];
        } else {
            console.error(ERROR_NO_LOCATION_GIVEN.format(npcName));
        }
        Data.npcList[Thing.id] = new Entity(npcName, npc.desc,
            parentPlace, xPos, yPos, npc.level,
            npc.baseStats, inventory);
    }

    Object.assign(Data.totalList, Data.npcList);

    console.log(Data.npcList);
    console.log('\n');
}

function createQuests() {
    console.log("Creating Quests");

    let questObject = JSON.parse(readFile(QUEST_LIST_FILE));

    for(let questName in questObject) {
        let q = questObject[questName];
        Data.questList[Thing.id] = new Quest(questName, q.desc, q.story, q.start);
    }

    Object.assign(Data.totalList, Data.questList);

    console.log(Data.questList);
    console.log('\n');
}

createTiles();
createPlaces();
createItems();
createMonsters();
createNPCs();
createQuests();

console.log("List of everything");
console.log(Data.totalList);
console.log('\n');


