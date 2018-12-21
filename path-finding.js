const directions = require("./directions/directions");
const directionsEnum = require("./directions/directions-enum");

/**
 * Both from and to are Points.
 * Returns the new path, which is a combination of movements.
 */
function pathFinding(map, from, to) {
    // Lets start with an eucledian distance
    const distX = from.x - to.x;
    const distY = from.y - to.y;

    let move;

    if (Math.abs(distX) > Math.abs(distY)) {
        if (distX > 0) {
            move = directionsEnum.EAST;
        } else {
            move = directionsEnum.WEST;
        }
    } else {
        if (distY > 0) {
            move = directionsEnum.NORTH;
        } else {
            move = directionsEnum.SOUTH;
        }
    }

    return move;
}

module.exports = pathFinding;
