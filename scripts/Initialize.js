import * as Data from './Data.js';
import {readFile} from "./Miscellaneous.js";

import Item, {itemTypeEnum} from './Thing/Item.js';
import Tool from './Thing/ItemTypes/Tool.js';
import Clothing from './Thing/ItemTypes/Clothing.js';
import Consumable from './Thing/ItemTypes/Consumable.js';

import Entity from './Thing/Entity.js';
import Tile from './Thing/Place/Tile.js';
import Place from './Thing/Place/Place.js';

const TILE_TEXT_FILE = "assets/json/tileText.json";
const PLACE_LIST_FILE = "assets/json/placeList.json";
const ITEM_LIST_FILE = "assets/json/itemList.json";
const MONSTER_LIST_FILE = "assets/json/monsterList.json";
const NPC_LIST_FILE = "assets/json/npcList.json";

const ERROR_NO_LOCATION_GIVEN = "No location given to place npc: {0}";

function createTiles() {
    console.log("Creating Tiles");

    let tileObject = JSON.parse(readFile(TILE_TEXT_FILE));

    for(let tileName in tileObject) {
        let tile = tileObject[tileName];
        Data.tileList[tileName] = new Tile(tileName, tile.desc, tile.dangerLevel);

        Data.tileList[tileName].myTiles[name] = Data.tileList[tileName];
    }

    console.log(Data.tileList);
    console.log('\n');
}

function createPlaces() {
    console.log("Creating Places");

    let placeObject = JSON.parse(readFile(PLACE_LIST_FILE));

    // push main map onto list
    Data.placeList["main"] = new Place("main", "main", null, -1, -1, 32, false);

    for(let placeName in placeObject) {
        let p = placeObject[placeName];
        Data.placeList[placeName] =
            new Place(placeName, p.desc, p.parentPlace,
                p.xPos, p.yPos, p.size, p.hasEntry);
    }

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
                Data.itemList[itemName] = new Item(itemName, item.desc, item.rarity,
                    item.type, item.value);
                break;
            case 2:
                Data.itemList[itemName] = new Tool(itemName, item.desc, item.rarity,
                    item.type, item.value, item.strength);
                break;
            case 3:
                Data.itemList[itemName] = new Clothing(itemName, item.desc, item.rarity,
                    item.type, item.value, item.resistance);
                break;
            case 4:
                Data.itemList[itemName] = new Consumable(itemName, item.desc, item.rarity,
                    item.type, item.value, item.strength);
                break;
            default:
                console.error("Unknown type: {0}".format(item.type));
        }
    }

    console.log(Data.itemList);
    console.log('\n');
}

function createMonsters() {
    console.log("Creating Monsters");

    let monsterObject = JSON.parse(readFile(MONSTER_LIST_FILE));

    for(let monsterName in monsterObject) {
        let m = monsterObject[monsterName];
        Data.monsterList[monsterName] = new Entity(monsterName, m.desc, null,
            -1, -1, m.level, m.baseStats, m.inventory);
    }

    console.log(Data.monsterList);
    console.log('\n');
}

function createNPCs() {
    console.log("Creating NPCs");

    let npcObject = JSON.parse(readFile(NPC_LIST_FILE));

    for(let npcName in npcObject) {
        let npc = npcObject[npcName];

        let xPos = -1;
        let yPos = -1;
        if("squareName" in npc) {
            xPos = Data.placeList[npc.squareName].xPos + npc["xDelta"];
            yPos = Data.placeList[npc.squareName].yPos + npc["yDelta"];
        } else if("squareType" in npc) {
            let tile = npc.squareType;
            let coordinates = Data.placeList[npc.parentPlace].getTileCoordinates(tile);
            xPos = coordinates[0];
            yPos = coordinates[1];
        } else {
            console.error(ERROR_NO_LOCATION_GIVEN.format(npcName));
        }
        Data.npcList[npcName] = new Entity(npcName, npc.desc, npc.parentPlace,
            xPos, yPos, npc.level, npc.baseStats, npc.inventory);
    }

    console.log(Data.npcList);
    console.log('\n');
}

function combine() {
    Object.assign(Data.totalList, Data.placeList, Data.tileList,
        Data.itemList, Data.monsterList, Data.npcList);
    console.log("List of everything");
    console.log(Data.totalList);
    console.log('\n');
}

createTiles();
createPlaces();
createItems();
createMonsters();
createNPCs();

combine();

