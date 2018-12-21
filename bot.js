var open = require("open");

var MapUtils = require("./map");
var Types = require("./types");

var directions = ["north", "south", "east", "west", "stay"];
var first = true;
function bot(state, callback) {
    if (first) {
        console.log("Open Browser at " + state.viewUrl);
        open(state.viewUrl);
        first = false;
    }

    var map = MapUtils.parseBoard(state.game.board);

    // Example how to use map and types
    // const currentPos = state.hero.pos;
    // if (map[currentPos.x + 1][currentPos.y] === Types.Mine) {
    //     console.log("Gold to the south!!!!");
    // }

    var dir = directions[Math.floor(Math.random() * directions.length)];
    console.log(dir);

    callback(null, dir);
}

function getTileAtPosition(currentPos, direction) {
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
