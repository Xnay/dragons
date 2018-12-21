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

// The predicate takes a tile(neighbor) returns false if this neightbor is not wanted.
function getNeightbors(map, currentPos, predicate) {
    var neighbors = [];

    for (const direction of directions) {
        const tileInDirection = getTileAtPosition(map, currentPos, direction);
        if (predicate(tileInDirection)) {
            neighbors.push(tileInDirection);
        }
    }
    return neighbors;
}

function getValidNeighbors(map, currentPos) {
    return getNeightbors(
        map,
        currentPos,
        tile => tile && tile.type == Types.Nothing
    );
}

function getValidDirections(map, currentPos) {
    var validDirections = [];
    for (const direction of directions) {
        const tileInDirection = getTileAtPosition(map, currentPos, direction);
        if (tileInDirection && tileInDirection.type == Types.Nothing) {
            validDirections.push(direction);
        }
    }
    return validDirections;
}

function getTileAtPosition(map, currentPos, direction) {
    if (direction === directionsEnum.NORTH) {
        if (currentPos.row <= 0) {
            return null;
        }
        return new Tile(
            currentPos.row - 1,
            currentPos.col,
            map[currentPos.row - 1][currentPos.col]
        );
    } else if (direction === directionsEnum.SOUTH) {
        if (currentPos.row >= map.length) {
            return null;
        }
        return new Tile(
            currentPos.row + 1,
            currentPos.col,
            map[currentPos.row + 1][currentPos.col]
        );
    } else if (direction === directionsEnum.EAST) {
        if (currentPos.col >= map.length) {
            return null;
        }
        return new Tile(
            currentPos.row,
            currentPos.col + 1,
            map[currentPos.row][currentPos.col + 1]
        );
    } else if (direction === directionsEnum.WEST) {
        if (currentPos.col <= 0) {
            return null;
        }
        return new Tile(
            currentPos.row,
            currentPos.col - 1,
            map[currentPos.row][currentPos.col - 1]
        );
    } else if (direction === directionsEnum.STAY) {
        return new Tile(
            currentPos.row,
            currentPos.col,
            map[currentPos.row][currentPos.col]
        );
    }
}

module.exports = {
    parseBoard,
    getNeightbors,
    getValidNeighbors,
    getValidDirections,
    getTileAtPosition,
};
