const directions = require("./directions/directions");

/**
 * Both from and to are Points.
 * Returns the new path, which is a combination of movements.
 */
function pathFinding(map, from, to) {
    // Lets start with an eucledian distance
    const distX = from.col - to.col;
    const distY = from.row - to.row;

    let move;

    if (Math.abs(distX) > Math.abs(distY)) {
        if (distX > 0) {
            //move =
        }
    }
}

module.exports = pathFinding;
