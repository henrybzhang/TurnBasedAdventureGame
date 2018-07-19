import * as Data from './Data.js';
import {readFile, findObj} from "./Miscellaneous.js";

import Thing from './Thing.js';
import Item, {itemTypeEnum} from './Thing/Item.js';
import Tool from './Thing/ItemTypes/Tool.js';
import Clothing from './Thing/ItemTypes/Clothing.js';
import Consumable from './Thing/ItemTypes/Consumable.js';

// Required Event order
import './Event/EventTypes/Inventory.js';

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

const START_X = 0;
const START_Y = 0;

function createTiles() {
    console.groupCollapsed("Creating Tiles");

    let tileObject = JSON.parse(readFile(TILE_TEXT_FILE));

    for(let tileName in tileObject) {
        let tile = tileObject[tileName];
        console.group(tileName);
        Data.tileList[Thing.id] = new Tile(tileName, tile.desc, tile.dangerLevel);
        console.groupEnd();
    }

    Object.assign(Data.totalList, Data.tileList);

    console.log(Data.tileList);

    console.groupEnd();
}

function createPlaces() {
    console.groupCollapsed("Creating Places");

    let placeObject = JSON.parse(readFile(PLACE_LIST_FILE));

    // push main map onto list
    console.group("main");
    Data.placeList[Thing.id] = new Place("main", "main", null, -1, -1, 32, false);
    console.groupEnd();

    for(let placeName in placeObject) {
        let p = placeObject[placeName];
        console.group(placeName);
        Data.placeList[Thing.id] =
            new Place(placeName, p.desc, findObj(p.parentPlace, Data.placeList),
                p.xPos, p.yPos, p.size, p.hasEntry);
        console.groupEnd();
    }

    Object.assign(Data.totalList, Data.placeList);

    console.log(Data.placeList);

    console.groupEnd();
}

function createItems() {
    console.groupCollapsed("Creating Items");

    let itemObject = JSON.parse(readFile(ITEM_LIST_FILE));

    for(let itemName in itemObject) {
        let item = itemObject[itemName];
        let itemType = itemTypeEnum[item.type];

        console.group(itemName);

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

        console.groupEnd();
    }

    Object.assign(Data.totalList, Data.itemList);

    console.log(Data.itemList);

    console.groupEnd();
}

function createMonsters() {
    console.groupCollapsed("Creating Monsters");

    let monsterObject = JSON.parse(readFile(MONSTER_LIST_FILE));
    let monsterHostility = 1;

    for(let monsterName in monsterObject) {
        let m = monsterObject[monsterName];
        let inventory = {};
        for(let itemName in m.inventory) {
            let item = findObj(itemName, Data.itemList);
            inventory[item.id] = m.inventory[itemName];
        }

        console.group(monsterName);

        Data.monsterList[Thing.id] = new Entity(monsterName, m.desc,
            findObj("main", Data.placeList), -1, -1, m.level, m.XP,
            m.baseStats, monsterHostility, inventory);

        console.groupEnd();
    }

    Object.assign(Data.totalList, Data.monsterList);

    console.log(Data.monsterList);

    console.groupEnd();
}

function createNPCs() {
    console.groupCollapsed("Creating NPCs");

    let npcHostility = 0;

    console.group("ME");
    let startStats = [10, 30, 8, 10];
    Data.npcList[Thing.id] = Data.createMe(new Entity("ME", "myDesc",
        findObj("main", Data.placeList), START_X, START_Y, 1, 0, startStats,
        npcHostility, {}));
    console.groupEnd();

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

        console.group(npcName);

        Data.npcList[Thing.id] = new Entity(npcName, npc.desc,
            parentPlace, xPos, yPos, npc.level, npc.XP,
            npc.baseStats, npcHostility, inventory);

        console.groupEnd();
    }

    Object.assign(Data.totalList, Data.npcList);

    console.log(Data.npcList);

    console.groupEnd();
}

function createQuests() {
    console.groupCollapsed("Creating Quests");

    let questObject = JSON.parse(readFile(QUEST_LIST_FILE));

    for(let questName in questObject) {
        let q = questObject[questName];
        console.group(questName);
        Data.questList[Thing.id] = new Quest(questName, q.desc, q.story, q.start);
        console.groupEnd();
    }

    Object.assign(Data.totalList, Data.questList);

    console.log(Data.questList);

    console.groupEnd();
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


