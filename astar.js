var MapUtils = require("./map");

var astar = {
    init: function(grid) {
        for (var x = 0, xl = grid.length; x < xl; x++) {
            for (var y = 0, yl = grid[x].length; y < yl; y++) {
                var node = grid[x][y];
                node.x = x;
                node.y = y;
                node.f = 0;
                node.g = 0;
                node.h = 0;
                node.cost = 1;
                node.visited = false;
                node.closed = false;
                node.parent = null;
            }
        }
    },
    heap: function() {
        return new BinaryHeap(function(node) {
            return node.f;
        });
    },
    search: function(grid, start, end, heuristic) {
        astar.init(grid);
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

            var neighbors = MapUtils.getValidNeighbors(grid, currentNode);

            for (var i = 0, il = neighbors.length; i < il; i++) {
                var neighbor = map[neighbors[i].x][neighbors[i].y];

                if (neighbor.closed) {
                    continue;
                }

                var gScore = currentNode.g + neighbor.cost;
                var beenVisited = neighbor.visited;

                if (!beenVisited || gScore < neighbor.g) {
                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    neighbor.h = neighbor.h || heuristic(neighbor.pos, end.pos);
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
