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

function isWalkable(tile) {
    return tile && tile.type === Types.Nothing;
}

function getValidNeighbors(map, currentPos) {
    var validNeighbors = [];
    var print = new Array(3);
    print[0] = new Array(3);
    print[1] = new Array(3);
    print[2] = new Array(3);
    print[0][0] = "E";
    print[1][1] = "P";
    print[0][2] = "E";
    print[2][0] = "E";
    print[2][2] = "E";
    var north = getTileAtPosition(map, currentPos, directionsEnum.NORTH);
    if (isWalkable(north)) {
        validNeighbors.push(north);
        print[0][1] = "O";
    } else {
        print[0][1] = "X";
    }
    var west = getTileAtPosition(map, currentPos, directionsEnum.WEST);
    if (isWalkable(west)) {
        validNeighbors.push(west);
        print[1][0] = "O";
    } else {
        print[1][0] = "X";
    }
    var east = getTileAtPosition(map, currentPos, directionsEnum.EAST);
    if (isWalkable(east)) {
        validNeighbors.push(east);
        print[1][2] = "O";
    } else {
        print[1][2] = "X";
    }
    var south = getTileAtPosition(map, currentPos, directionsEnum.SOUTH);
    if (isWalkable(south)) {
        validNeighbors.push(south);
        print[2][1] = "O";
    } else {
        print[2][1] = "X";
    }

    //console.log(currentPos);
    //console.log(print);

    return validNeighbors;
}

function getTileAtPosition(map, currentPos, direction) {
    if (direction === directionsEnum.NORTH) {
        if (currentPos.x <= 0) {
            return null;
        }
        return new Tile(
            currentPos.x - 1,
            currentPos.y,
            map[currentPos.x - 1][currentPos.y]
        );
    } else if (direction === directionsEnum.SOUTH) {
        if (currentPos.x >= map.length) {
            return null;
        }
        return new Tile(
            currentPos.x + 1,
            currentPos.y,
            map[currentPos.x + 1][currentPos.y]
        );
    } else if (direction === directionsEnum.EAST) {
        if (currentPos.y >= map.length) {
            return null;
        }
        return new Tile(
            currentPos.x,
            currentPos.y + 1,
            map[currentPos.x][currentPos.y + 1]
        );
    } else if (direction === directionsEnum.WEST) {
        if (currentPos.y <= 0) {
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
    getTileAtPosition,
};
