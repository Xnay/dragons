var MapUtils = require("./map");
var Point = require("./point.js");
const Tile = require("./tile");

class Node {
    constructor(tile) {
        this.tile = tile;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.cost = 1;
        this.visited = false;
        this.closed = false;
        this.parent = null;
    }
}

var astar = {
    init: function(map) {
        var grid = [];
        for (let x = 0; x < map.length; x++) {
            for (let y = 0; y < map.length; y++) {
                grid.push(new Node(new Tile(x, y, map[x][y])));
            }
        }
        return grid;
    },
    heap: function() {
        return new BinaryHeap(function(node) {
            return node.f;
        });
    },
    search: function(map, startingTile, endingTile, heuristic) {
        let grid = astar.init(map);
        let start =
            grid[
                startingTile.position.x + map.length * startingTile.position.y
            ];
        let end =
            grid[endingTile.position.x + map.length * endingTile.position.y];
        heuristic = heuristic || astar.manhattan;

        var openHeap = astar.heap();

        openHeap.push(start);

        while (openHeap.size() > 0) {
            var currentNode = openHeap.pop();

            if (currentNode === end) {
                var curr = currentNode;
                var ret = [];
                while (curr.parent) {
                    ret.push(curr);
                    curr = curr.parent;
                }
                return ret.reverse();
            }

            currentNode.closed = true;

            var neighbors = MapUtils.getValidNeighbors(
                map,
                new Point(
                    currentNode.tile.position.x,
                    currentNode.tile.position.y
                )
            );

            for (var i = 0; i < neighbors.length; i++) {
                var tile = neighbors[i];
                var neighbor =
                    grid[tile.position.x + map.length * tile.position.y];

                if (neighbor.closed) {
                    continue;
                }

                var gScore = currentNode.g + neighbor.cost;
                var beenVisited = neighbor.visited;

                if (!beenVisited || gScore < neighbor.g) {
                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    neighbor.h =
                        neighbor.h ||
                        heuristic(neighbor.tile.position, end.tile.position);
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;

                    if (!beenVisited) {
                        openHeap.push(neighbor);
                    } else {
                        openHeap.rescoreElement(neighbor);
                    }
                }
            }
        }

        return [];
    },
    manhattan: function(pos0, pos1) {
        var d1 = Math.abs(pos1.x - pos0.x);
        var d2 = Math.abs(pos1.y - pos0.y);
        return d1 + d2;
    },
};

function BinaryHeap(scoreFunction) {
    this.content = [];
    this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
    push: function(element) {
        this.content.push(element);
        this.sinkDown(this.content.length - 1);
    },
    pop: function() {
        var result = this.content[0];
        var end = this.content.pop();
        if (this.content.length > 0) {
            this.content[0] = end;
            this.bubbleUp(0);
        }
        return result;
    },
    remove: function(node) {
        var i = this.content.indexOf(node);
        var end = this.content.pop();

        if (i !== this.content.length - 1) {
            this.content[i] = end;

            if (this.scoreFunction(end) < this.scoreFunction(node)) {
                this.sinkDown(i);
            } else {
                this.bubbleUp(i);
            }
        }
    },
    size: function() {
        return this.content.length;
    },
    rescoreElement: function(node) {
        this.sinkDown(this.content.indexOf(node));
    },
    sinkDown: function(n) {
        var element = this.content[n];

        while (n > 0) {
            var parentN = ((n + 1) >> 1) - 1;
            var parent = this.content[parentN];
            if (this.scoreFunction(element) < this.scoreFunction(parent)) {
                this.content[parentN] = element;
                this.content[n] = parent;
                n = parentN;
            } else {
                break;
            }
        }
    },
    bubbleUp: function(n) {
        var length = this.content.length;
        var element = this.content[n];
        var elemScore = this.scoreFunction(element);

        while (true) {
            var child2N = (n + 1) << 1;
            var child1N = child2N - 1;
            var swap = null;
            var child1Score;
            if (child1N < length) {
                // Look it up and compute its score.
                var child1 = this.content[child1N];
                child1Score = this.scoreFunction(child1);
                if (child1Score < elemScore) {
                    swap = child1N;
                }
            }

            if (child2N < length) {
                var child2 = this.content[child2N];
                var child2Score = this.scoreFunction(child2);
                if (child2Score < (swap === null ? elemScore : child1Score)) {
                    swap = child2N;
                }
            }

            if (swap !== null) {
                this.content[n] = this.content[swap];
                this.content[swap] = element;
                n = swap;
            } else {
                break;
            }
        }
    },
};

module.exports = astar;
