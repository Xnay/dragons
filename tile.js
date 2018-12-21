var Point = require("./point.js");

class Tile {
    constructor(x, y, type) {
        this.position = new Point(x, y);
        this.type = type;
    }
}

module.exports = Tile;
