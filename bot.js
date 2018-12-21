var open = require("open");

var MapUtils = require("./map");
var Types = require("./types");
const Point = require("./point");
const directions = require("./directions/directions");
const directionsEnum = require("./directions/directions-enum");

var first = true;

function bot(state, callback) {
    if (first) {
        console.log("Open Browser at " + state.viewUrl);
        open(state.viewUrl);
        first = false;
    }

    var map = MapUtils.parseBoard(state.game.board);
    const currentPos = state.hero.pos;
    var validDirections = getValidDirections(map, currentPos);

    var dir = validDirections[Math.floor(Math.random() * directions.length)];

    let nextTarget;
    if (state.hero.life < 50) {
        //find nearest tavern
        nextTarget = nearestTavern;
    } else {
        // find nearest mine
    }
    console.log(dir);

    callback(null, dir);
}

function findNearestPositionOfType(map, mapSize, heroPosition, type) {
    let x = 0;
    let y = 0;
    let positions = [];
    while (x < mapSize) {
        while (y < mapSize) {}

        mapSize++;
    }
}

function getValidDirections(map, currentPos) {
    var validDirections = [];
    for (const direction of directions) {
        const tileInDirection = getTileAtPosition(map, currentPos, direction);
        if (
            tileInDirection === Types.Spike ||
            tileInDirection === Types.Tree ||
            tileInDirection === Types.Player
        ) {
        } else {
            validDirections.push(direction);
        }
    }
    return validDirections;
}

function getTileAtPosition(map, currentPos, direction) {
    if (direction === directionsEnum.NORTH) {
        return map[currentPos.x - 1][currentPos.y];
    } else if (direction === directionsEnum.SOUTH) {
        return map[currentPos.x + 1][currentPos.y];
    } else if (direction === directionsEnum.EAST) {
        return map[currentPos.x][currentPos.y + 1];
    } else if (direction === directionsEnum.WEST) {
        return map[currentPos.x][currentPos.y - 1];
    } else if (direction === directionsEnum.STAY) {
        return map[currentPos.x][currentPos.y];
    }
}

module.exports = bot;
if (require.main === module) require("./client/index").cli(bot);
