var open = require("open");

var MapUtils = require("./map");
var Types = require("./types");
const Point = require("./point");
const Tile = require("./tile");
const directions = require("./directions/directions");
const directionsEnum = require("./directions/directions-enum");
const astar = require("./astar");

var first = true;

var ownedMinesPositions = [];
var heroesLastTick = null;

function bot(state, callback) {
    if (first) {
        console.log("Open Browser at " + state.viewUrl);
        open(state.viewUrl);
        first = false;
    }

    var map = MapUtils.parseBoard(state.game.board);
    const currentPos = state.hero.pos;
    var validDirections = MapUtils.getValidDirections(map, currentPos);

    // détecter si une mine est prise
    for (let hero of state.game.heroes) {
        let heroPosition = new Point(hero.pos.x, hero.pos.y);

        if (map[heroPosition.row][heroPosition.col] == Types.Mine) {
            if (hero.id === state.hero.id) {
                // si c'est le current player, ajouter au owned mines
                if (!ownedMinesPositions.includes(heroPosition)) {
                    ownedMinesPositions.push(heroPosition);
                }
            } else {
                // si c'est un enemy enlever des owned mines s'il l'est présentement
                var ownedMineIndex = ownedMinesPositions.indexOf(heroPosition);

                if (ownedMineIndex > -1) {
                    ownedMinesPositions.splice(ownedMineIndex, 1);
                }
            }
        }
    }

    let nextTarget;
    if (state.hero.life < 50) {
        //find nearest tavern
        nextTarget = findNearestPositionOfType(map, currentPos, Types.Tavern);
    } else {
        //find nearest mine
        nextTarget = findNearestPositionOfType(map, currentPos, Types.Mine);
    }

    //var dir = astar.search(map, currentPos, nextTarget);
    var dir =
        validDirections[Math.floor(Math.random() * validDirections.length)];

    console.log(dir);

    var ownedMinesMessage =
        "owned mines: count(" + ownedMinesPositions.length + "): ";
    for (const ownedMinesPosition of ownedMinesPositions) {
        ownedMinesMessage +=
            "(" + ownedMinesPosition.col + ", " + ownedMinesPosition.row + ") ";
    }

    console.log(ownedMinesMessage);

    callback(null, dir);
}

function findNearestPositionOfType(map, heroPosition, type) {
    let tiles = [];
    for (let x = 0; x < map.length; x++) {
        for (let y = 0; y < map.length; y++) {
            const currentType = map[x][y];
            if (currentType === type) {
                if (type === Types.Mine) {
                    let isOwnedMine = false;
                    // filter out owned mines
                    for (const ownedMinePosition of ownedMinesPositions) {
                        if (
                            ownedMinePosition.col === x &&
                            ownedMinePosition.row === y
                        ) {
                            isOwnedMine = true;
                        }
                    }

                    if (!isOwnedMine) {
                        tiles.push(new Tile(x, y, map[x][y]));
                    }
                } else {
                    tiles.push(new Tile(x, y, map[x][y]));
                }
            }
        }
    }

    let nearestTile;
    let minimumDistance = 100000;
    let i = 0;
    while (i < tiles.length) {
        let distance = Math.sqrt(
            Math.pow(heroPosition.x - tiles[i].position.col, 2) +
                Math.pow(heroPosition.y - tiles[i].position.row, 2)
        );
        if (distance < minimumDistance) {
            minimumDistance = distance;
            nearestTile = tiles[i];
        }

        i++;
    }

    console.log(
        "target:" +
            nearestTile.position.row +
            " " +
            nearestTile.position.col +
            " " +
            nearestTile.type
    );
    return nearestTile;
}

module.exports = bot;
if (require.main === module) require("./client/index").cli(bot);
