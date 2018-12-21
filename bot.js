var open = require("open");

var MapUtils = require("./map");
var Types = require("./types");
const Point = require("./point");
const Tile = require("./tile");
const directions = require("./directions/directions");
const DirectionUtils = require("./directions/direction-utils");
const directionsEnum = require("./directions/directions-enum");
const astar = require("./astar");

var first = true;

var ownedMinesPositions = [];
var isAtTavern = false;

function bot(state, callback) {
    try {
        doBot(state, callback);
    } catch (err) {
        callback(null, "stay");
    }
}

function doBot(state, callback) {
    if (first) {
        console.log("Open Browser at " + state.viewUrl);
        open(state.viewUrl);
        first = false;
    }

    var map = MapUtils.parseBoard(state.game.board);
    const currentPos = state.hero.pos;
    var validNeighbors = MapUtils.getValidNeighbors(
        map,
        new Point(currentPos.x, currentPos.y)
    );

    // détecter si une mine est prise
    for (let hero of state.game.heroes) {
        let heroPosition = new Point(hero.pos.x, hero.pos.y);
        const heroMouvement = DirectionUtils.getMoveFromDirection(hero.lastDir);
        // If the user is moving, check if he aquired a mine.
        if (heroMouvement) {
            var x = heroPosition.x + heroMouvement.x;
            var y = heroPosition.y + heroMouvement.y;
            if (
                x >= 0 &&
                x < map.length &&
                y >= 0 &&
                y < map.length &&
                map[x][y] === Types.Mine
            ) {
                // Vérifier si on se fait voler notre mine.
                if (hero.id !== state.hero.id) {
                    // si c'est un enemy enlever des owned mines s'il l'est présentement
                    var ownedMineIndex = ownedMinesPositions.indexOf(
                        heroPosition
                    );

                    if (ownedMineIndex > -1) {
                        ownedMinesPositions.splice(ownedMineIndex, 1);
                    }
                }
            }
        }
    }

    let nextTarget;
    if (state.hero.life < 50 || (isAtTavern && state.hero.life <= 90)) {
        //find nearest tavern
        nextTarget = findNearestPositionOfType(map, currentPos, Types.Tavern);
    } else {
        //find nearest mine
        nextTarget = findNearestPositionOfType(map, currentPos, Types.Mine);
    }

    const path = astar.search(
        map,
        new Tile(currentPos.x, currentPos.y, map[currentPos.x][currentPos.y]),
        nextTarget
    );

    const dir =
        path.length > 0
            ? getDirectionForTile(currentPos, path[0].tile.position)
            : getDirectionForTile(
                  currentPos,
                  validNeighbors[
                      Math.floor(Math.random() * validNeighbors.length)
                  ].position
              );
    if (path.length < 1) {
        console.log("ASTAR returned empty!");
    } else {
        if (path[0].tile.type === Types.Mine) {
            if (!ownedMinesPositions.includes(path[0].tile.position)) {
                ownedMinesPositions.push(path[0].tile.position);
            }
        }

        if (path[0].tile.type === Types.Tavern) {
            isAtTavern = true;
        } else {
            isAtTavern = false;
        }
    }

    console.log(dir);

    var ownedMinesMessage =
        "owned mines: count(" + ownedMinesPositions.length + "): ";
    for (const ownedMinesPosition of ownedMinesPositions) {
        ownedMinesMessage +=
            "(" + ownedMinesPosition.x + ", " + ownedMinesPosition.y + ") ";
    }

    console.log(ownedMinesMessage);

    callback(null, dir);
}

function getDirectionForTile(currentPos, targetPos) {
    const x = targetPos.x - currentPos.x;
    const y = targetPos.y - currentPos.y;

    if (x === 0 && y === 1) {
        return directionsEnum.EAST;
    } else if (x === 0 && y === -1) {
        return directionsEnum.WEST;
    } else if (x === 1 && y === 0) {
        return directionsEnum.SOUTH;
    } else if (x === -1 && y === 0) {
        return directionsEnum.NORTH;
    }

    console.log("STAYING OH NO");
    return directionsEnum.STAY;
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
                            ownedMinePosition.x === x &&
                            ownedMinePosition.y === y
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
            Math.pow(heroPosition.x - tiles[i].position.x, 2) +
                Math.pow(heroPosition.y - tiles[i].position.y, 2)
        );
        if (distance < minimumDistance) {
            minimumDistance = distance;
            nearestTile = tiles[i];
        }

        i++;
    }

    console.log(
        "target:" +
            nearestTile.position.x +
            " " +
            nearestTile.position.y +
            " " +
            nearestTile.type
    );
    return nearestTile;
}

module.exports = bot;
if (require.main === module) require("./client/index").cli(bot);
