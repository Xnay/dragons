const direcitonsEnum = require("./directions-enum");

class DirectionUtils {
    /** Returns null if the direction is null */
    static getMoveFromDirection(direction) {
        // Direction is undefined if player never moved before.
        if (!direction) {
            return null;
        }

        const move = {
            x: 0,
            y: 0,
        };

        const loweredDirection = direction.toLowerCase();

        if (loweredDirection === direcitonsEnum.EAST) {
            move.y = 1;
        } else if (loweredDirection === direcitonsEnum.WEST) {
            move.y = -1;
        } else if (loweredDirection === direcitonsEnum.SOUTH) {
            move.x = 1;
        } else if (loweredDirection === direcitonsEnum.NORTH) {
            move.x = -1;
        }

        return move;
    }
}

module.exports = DirectionUtils;
