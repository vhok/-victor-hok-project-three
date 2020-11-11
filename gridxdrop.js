// An array 'item' containing all furniture objects.
const item = [{
        sku: 'BEDDBLNEL',
        name: "Neljyak Double Bed",
        description: "He complained, 'What do I look like to you, a furniture designer?' But, since his Boss submitted the request, he had no choice. Crafted with black walnut wood and titanium tubing. This bed was made to last.",
        price: 499.99,
        sizeX: 2,
        sizeY: 3,
        position: {
            x: 0,
            y: 0,
            orientation: 0
        },
        deployed: false
    },
    {
        sku: 'SOFAMARA',
        name: "Marathon Sofa",
        description: "Super comfortable. Fits at least 3 people. Perfect for friends crashing over for a marathon of 'Buffy the Vampire Slayer'.",
        price: 349.99,
        sizeX: 3,
        sizeY: 1,
        position: {
            x: 0,
            y: 0,
            orientation: 0
        },
        deployed: false
    },
    {
        sku: 'FRIDGEBIG',
        name: "One Big Fridge",
        description: "It was a commercial grade fridge. Why would you ever need one that huge?... But, HEY, it was on SALE.",
        price: 199.99,
        sizeX: 3,
        sizeY: 2,
        position: {
            x: 0,
            y: 0,
            orientation: 0
        },
        deployed: false
    }];

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


        for (let i = 0; i < x; i++) {
            let tempArray = [];

            for (let j = 0; j < y; j++) {
                // Creates a 'cell' object, appends it to the grid, and pushes its jQuery object into a temporary array.
                tempArray.push({occupied: false, element: $(`<div class="floor-plan__div-cell"></div>`).appendTo("#floor-plan__div-grid")});
                // DELETE: tempArray.push($(`<div class="floor-plan__div-cell"></div>`).appendTo("#floor-plan__div-grid"));
            }
            // Pushes the vertical array into cellArray.
            this.cellArray.push(tempArray);
        }

        // Sets the width of the grid in pixels based on value x specified by user.
        // IMPORTANT: This value must be in sync with _variables.scss $cell-unit.
        $(".floor-plan__div-grid").width(50 * x);
        this.sizeX = x;
        this.sizeY = y;
    }
};

// All the functions you need to manipulate things.
const widget = {

}

// DOCUMENT READY
$(function() {

    grid.init(10, 10);
    // grid.cellArray[0][0];
});