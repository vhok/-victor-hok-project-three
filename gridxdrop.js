const item = {
};



const cell = {
};

cell.occupied = false;



const grid = {
    // grid properties
    // sizeX: The horizontal length of the grid in units of "cells".
    // sizeY: The vertical length of the grid in units of "cells".
    // cellArray: An array that represents all the cells on the grid.
    sizeX: 0,
    sizeY: 0,
    cellArray: [],


    // ***** gridInit *****
    // Description: Sets the grid size based on user input.
    init: function (x = 1, y = 1) {
        sizeX = x;
        sizeY = y;
        cellArray = [];

        // Purpose: To create a two-dimensional array where cellArray[x][y] accesses the specific cell located at (x, y).
        //
        // Method: The code below stuffs an array of cells into each entry of cellArray.
        // e.g. for a 2x2 grid... cellArray = [ column0, column1 ], where column0 = [ cell0, cell1 ], etc...
        //
        //      GRID
        //
        //    col0  col1
        //  _____________
        //  |     |     |
        //  | 0,0 | 1,0 |
        //  |_____|_____|
        //  |     |     |
        //  | 0,1 | 1,1 |
        //  |_____|_____|
        //
        const tempArray = [];

        for (let i = 0; i < sizeX; i++) {
            for (let j = 0; j < sizeY; j++) {
                // Creates a div element, appends it to the grid, and pushes its jQuery object into a temporary array.
                tempArray.push($(`<div class="floor-plan__div-cell"></div>`).appendTo("#floor-plan__div-grid"));
            }
            // Pushes the vertical array into cellArray.
            cellArray.push(tempArray);

            // Clears the array without having to create a new one. 
            // The other option would be to use 'let' instead of 'const' so that you may set tempArray = [];
            tempArray.length = 0;
        }

        // Sets the width of the grid in pixels based on value x specified by user.
        $(".floor-plan__div-grid").width(50 * sizeX);
    }
};

// DOCUMENT READY
$(function() {

    grid.init(10, 10);

});