var Types = require("./types");
var Tile = require("./tile");
const directions = require("./directions/directions");
const directionsEnum = require("./directions/directions-enum");

/* get type for a pair of char */
function getType(a, b) {
    if (isNothing(a, b)) {
        return Types.Nothing;
    } else if (isTree(a, b)) {
        return Types.Tree;
    } else if (isPlayer(a, b)) {
        return Types.Player;
    } else if (isMine(a, b)) {
        return Types.Mine;
    } else if (isTavern(a, b)) {
        return Types.Tavern;
    } else if (isSpike(a, b)) {
        return Types.Spike;
    } else {
        return Types.Unknown;
    }
}

/* helper functions */
function isNothing(a, b) {
    return a == " " && b == " ";
}
function isTree(a, b) {
    return a == "#" && b == "#";
}
function isPlayer(a, b) {
    return a == "@";
}
function isMine(a, b) {
    return a == "$";
}
function isSpike(a, b) {
    return a == "^" && b == "^";
}
function isTavern(a, b) {
    return a == "[" && b == "]";
}

/* magic map parsing */
function parseBoard(board) {
    var map = [];
    var size = board.size;

    var tiles = board.tiles;
    var x = 0;
    var y = 0;
    map[0] = [];
    for (var idx = 0; idx < size * size; idx++) {
        var strIdx = idx * 2;
        var chr = tiles.slice(strIdx, strIdx + 2);
        var type = getType(chr[0], chr[1]);

        map[x][y] = type;

        y++;
        if (y >= size) {
            y = 0;
            x++;
            map[x] = [];
        }
    }

    return map;
}

function getValidNeighbors(map, currentPos) {
    var validNeighbors = [];
    for (const direction of directions) {
        const tileInDirection = getTileAtPosition(map, currentPos, direction);
        if (
            !tileInDirection ||
            tileInDirection.type === Types.Spike ||
            tileInDirection.type === Types.Tree ||
            tileInDirection.type === Types.Player
        ) {
        } else {
            validNeighbors.push(tileInDirection);
        }
    }
    return validNeighbors;
}

function getValidDirections(map, currentPos) {
    var validDirections = [];
    for (const direction of directions) {
        const tileInDirection = getTileAtPosition(map, currentPos, direction);
        if (
            !tileInDirection ||
            tileInDirection.type === Types.Spike ||
            tileInDirection.type === Types.Tree ||
            tileInDirection.type === Types.Player
        ) {
        } else {
            validDirections.push(direction);
        }
    }
    return validDirections;
}

function getTileAtPosition(map, currentPos, direction) {
    if (direction === directionsEnum.NORTH) {
        if (currentPos.x == 0) {
            return null;
        }
        return new Tile(
            currentPos.x - 1,
            currentPos.y,
            map[currentPos.x - 1][currentPos.y]
        );
    } else if (direction === directionsEnum.SOUTH) {
        if (currentPos.x == map.length) {
            return null;
        }
        return new Tile(
            currentPos.t + 1,
            currentPos.y,
            map[currentPos.x + 1][currentPos.y]
        );
    } else if (direction === directionsEnum.EAST) {
        if (currentPos.y == map.length) {
            return null;
        }
        return new Tile(
            currentPos.x,
            currentPos.y + 1,
            map[currentPos.x][currentPos.y + 1]
        );
    } else if (direction === directionsEnum.WEST) {
        if (currentPos.y == 0) {
            return null;
        }
        return new Tile(
            currentPos.x,
            currentPos.y - 1,
            map[currentPos.x][currentPos.y - 1]
        );
    } else if (direction === directionsEnum.STAY) {
        return new Tile(
            currentPos.x,
            currentPos.y,
            map[currentPos.x][currentPos.y]
        );
    }
}

module.exports = {
    parseBoard,
    getValidNeighbors,
    getValidDirections,
    getTileAtPosition,
};
