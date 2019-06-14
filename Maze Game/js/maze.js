Maze = function (width, height) {

    if (height % 2 == 0) {
        height++;
    }
    if (width % 2 == 0) {
        width++;
    }

    var self = this;

    var width = width;
    var height = height;

    var maze = Array(width);
    for (var i = 0; i < maze.length; i++) {
        maze[i] = new Array(height);
    }

    var path = [];

    //Constants for different maze tile types
    var AIR = 0;
    var WALL = 1;
    var RED_DOOR = 2;
    var BLUE_DOOR = 3;
    var GREEN_DOOR = 4;
    var YELLOW_DOOR = 5;
    var RED_KEY = 6;
    var BLUE_KEY = 7;
    var GREEN_KEY = 8;
    var YELLOW_KEY = 9;

    this.AIR = 0;
    this.WALL = 1;
    this.RED_DOOR = 2;
    this.BLUE_DOOR = 3;
    this.GREEN_DOOR = 4;
    this.YELLOW_DOOR = 5;
    this.RED_KEY = 6;
    this.BLUE_KEY = 7;
    this.GREEN_KEY = 8;
    this.YELLOW_KEY = 9;

    //Remove the cube at given coordinates
    function setEmpty(maze, x, y) {
        maze[x][y] = AIR;
    }

    //Get spaces adjacent to given maze space
    function getNeighbours(maze, x, y, type, range) {
        var result = [];
        var width = maze.length;
        var height = maze[0].length;
        if (y + range < height && maze[x][y + range] == type) {
            result.push({ x: x, y: y + range });
        }
        if (x + range < width && maze[x + range][y] == type) {
            result.push({ x: x + range, y: y });
        }
        if (y - range >= 0 && maze[x][y - range] == type) {
            result.push({ x: x, y: y - range });
        }
        if (x - range >= 0 && maze[x - range][y] == type) {
            result.push({ x: x - range, y: y });
        }

        return result;
    }
	
	//Get spaces adjacent to given maze space
    function getNeighboursInverse(maze, x, y, type, range) {
        var result = [];
        var width = maze.length;
        var height = maze[0].length;
        if (y + range < height && maze[x][y + range] != type) {
            result.push({ x: x, y: y + range });
        }
        if (x + range < width && maze[x + range][y] != type) {
            result.push({ x: x + range, y: y });
        }
        if (y - range >= 0 && maze[x][y - range] != type) {
            result.push({ x: x, y: y - range });
        }
        if (x - range >= 0 && maze[x - range][y] != type) {
            result.push({ x: x - range, y: y });
        }

        return result;
    }

    //Connect an empty space to the maze
    function connectEdge(maze, edge) {
        if (maze[edge.x][edge.y] == 1) {
            var neighbors = getNeighbours(maze, edge.x, edge.y, AIR, 2);

            if (neighbors.length > 0) {
                var i = Math.floor((Math.random() * neighbors.length));
                var removeX = Math.floor((neighbors[i].x + edge.x) / 2);
                var removeY = Math.floor((neighbors[i].y + edge.y) / 2);
                setEmpty(maze, edge.x, edge.y);
                setEmpty(maze, removeX, removeY);
            }
        }
        else {
            setEmpty(maze, edge.x, edge.y);
        }
    }

    //Find the solution to the maze
    function findPath(maze, x, y, tempPath) {
        if (maze[x][y] == WALL) {
            return false
        }
        if (x == width - 2 && y == height - 1) {
            tempPath.push({ x: x, y: y });
            return true;
        }
        maze[x][y] = 1;
        var cells = getNeighboursInverse(maze, x, y, WALL, 1);
        for (var i = 0; i < cells.length; i++) {
            if (findPath(maze, cells[i].x, cells[i].y, tempPath)) {
                tempPath.push({ x: x, y: y });
                return true;
            }
        }
    }

    //Deep-copy an object, making a completely new object
    function copy(o) {
        var output, v, key;
        output = Array.isArray(o) ? [] : {};
        for (key in o) {
            v = o[key];
            output[key] = (typeof v === "object") ? copy(v) : v;
        }
        return output;
    }

    //Finds dead ends in the maze that can be reached from the given x,y
    function findEnds(maze, x, y, ends) {
        if (maze[x][y] != AIR) {
            return;
        }
        if (getNeighbours(maze, x, y, 1, 1).length > 2) {
            ends.push({ x: x, y: y });
            return;
        }
        maze[x][y] = 6;
        var cells = getNeighbours(maze, x, y, AIR, 1);
        for (var i = 0; i < cells.length; i++) {
            findEnds(maze, cells[i].x, cells[i].y, ends);
        }
    }

    this.createMaze = function () {
        var edges = [];

        //fill the maze with walls
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                maze[x][y] = WALL;
            }
        }

        //set start point of the maze
        var startX = 1;
        var startY = 1;

        //remove the wall from the start point
        setEmpty(maze, startX, startY);

        edges = getNeighbours(maze, startX, startY, WALL, 2);

        //create the maze
        while (edges.length > 0) {
            var i = Math.floor((Math.random() * edges.length));
            var edge = edges[i];
            connectEdge(maze, edge);
            edges.splice(i, 1);
            edges = edges.concat(getNeighbours(maze, edge.x, edge.y, WALL, 2));
        }

        //add entrance and exit to the maze
        setEmpty(maze, 1, 0);
        setEmpty(maze, width - 2, height - 1);

        var solvedMaze = copy(maze);
        findPath(solvedMaze, 1, 0, path);

        var doorInterval = Math.floor(path.length / 5);

        //Add the coloured doors to the maze
        for (var i = RED_DOOR; i <= YELLOW_DOOR; i++) {
            var steps = doorInterval * (i - 1);
            maze[path[steps].x][path[steps].y] = i;

            var ends = [];
            var endMaze = copy(maze);
            findEnds(endMaze, path[steps + 1].x, path[steps + 1].y, ends);
            var j = Math.floor((Math.random() * ends.length));
            maze[ends[j].x][ends[j].y] = i + 4;
        }
    }

    this.getWidth = function () {
        return width;
    }

    this.getHeight = function () {
        return height;
    }

    this.getPath = function () {
        return path;
    }

    this.getMaze = function () {
        return maze;
    }
	
	this.findPath = function (x, y) {
		var newPath = [];
        var tempMaze = copy(maze);
        findPath(tempMaze, x, y, newPath);
		return newPath;
    }
}
