var open = require("open");

var MapUtils = require("./map");
var Types = require("./types");
const Point = require("./point");
const directions = require("./directions/directions");

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
        nextTarget = findNearestPositionOfType(map, currentPos, Types.Tavern);
    } else {
        //find nearest mine
        nextTarget = findNearestPositionOfType(map, currentPos, Types.Mine);
    }

    console.log(dir);

    callback(null, dir);
}

function findNearestPositionOfType(map, heroPosition, type) {
    let x = 0;
    let y = 0;
    let positions = [];
    while (x < map.length) {
        while (y < map.length) {
            if (map[x][y] === type) {
                positions.push(new Point(x, y));
            }
            y++;
        }
        x++;
    }

    let nearestPosition;
    let minimumDistance = 100000;
    let i = 0;
    while (i < positions.length) {
        let distance = Math.sqrt(
            Math.pow(heroPosition.x - positions[i].col, 2) +
                Math.pow(heroPosition.y - positions[i].row, 2)
        );
        if (distance < minimumDistance) {
            minimumDistance = distance;
            nearestPosition = positions[i];
        }

        i++;
    }

    return nearestPosition;
}

function getValidDirections(map, currentPos) {
    var validDirections = [];
    directions.forEach((direction, index) => {
        const tileInDirection = getTileAtPosition(map, currentPos, direction);
        if (
            tileInDirection === Types.Spike ||
            tileInDirection === Types.Tree ||
            tileInDirection === Types.Player
        ) {
        } else {
            validDirections.push(direction);
        }
    });

    return validDirections;
}

function getTileAtPosition(map, currentPos, direction) {
    if (direction === "north") {
        return map[currentPos.x - 1][currentPos.y];
    } else if (direction === "south") {
        return map[currentPos.x + 1][currentPos.y];
    } else if (direction === "east") {
        return map[currentPos.x][currentPos.y + 1];
    } else if (direction === "west") {
        return map[currentPos.x][currentPos.y - 1];
    } else if (direction === "stay") {
        return map[currentPos.x][currentPos.y];
    }
}

module.exports = bot;
if (require.main === module) require("./client/index").cli(bot);
