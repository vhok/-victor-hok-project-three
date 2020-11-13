// Global variable
// IMPORTANT: The of cellUnit must be in sync with _variables.scss $cell-unit for uniformity between CSS and JS.
const cellUnit = 50;

// An array 'item' containing all furniture objects. Global array.
const item = [{
        sku: 'BEDDBLNEL',
        name: "Neljyak Double Bed",
        id: 'bed',
        imgId: '#tool__div-img-bed',
        description: "Crafted with black walnut wood and titanium tubing. This bed was made to last.",
        price: 499.99,
        sizeX: 2,
        sizeY: 3,
        url: './assets/noun_double_bed_3x2.png',
        position: {
            x: 0,
            y: 0,
            rotate: 0
        },
        deployed: false
    },
    {
        sku: 'SOFAMARA',
        name: "Marathon Sofa",
        id: 'sofa',
        imgId: '#tool__div-img-sofa',
        description: "Super comfortable. Fits at least 3 people. Perfect for friends crashing over for a marathon of 'Buffy the Vampire Slayer'.",
        price: 349.99,
        sizeX: 3,
        sizeY: 1,
        url: './assets/noun_Sofa_3x1.png',
        position: {
            x: 0,
            y: 0,
            rotate: 0
        },
        deployed: false
    },
    {
        sku: 'FRIDGEBIG',
        name: "One Big Fridge",
        id: 'fridge',
        imgId: '#tool__div-img-fridge',
        description: "It was a commercial grade fridge. Why would you ever need one that big?... But, HEY, it was on SALE.",
        price: 199.99,
        sizeX: 3,
        sizeY: 2,
        url: './assets/noun_Refrigerator_3x2.png',
        position: {
            x: 0,
            y: 0,
            rotate: 0
        },
        deployed: false
}];


// All the functions you need to manipulate things.
const widget = {};

widget.moveListener = () => {
    // Creates an array where the value of the id property is the (only) value stored in each element. This is a preliminary step to locating the item's index based on which input you clicked on.
    const itemIdArray = item.map((element) => element.id);

    $('form').on('submit', function(event) {
        event.preventDefault();
        const x = $('#cell-x').val();
        const y = $('#cell-y').val();

        // Retrieves the index of the active item.
        const itemIndex = itemIdArray.indexOf(`${$('input[name="furniture"]:checked').attr('id')}`);
        const activeItem = item[itemIndex];

        $(`
        <div class="floor-plan__div-img">
            <img src=${activeItem.url} alt=${activeItem.description}>
        </div>`).appendTo('#floor-plan__div-grid').width(activeItem.sizeX * cellUnit);
    });
};


const grid = {};
// grid properties
// sizeX: The horizontal length of the grid in units of "cells".
// sizeY: The vertical length of the grid in units of "cells".
// cellArray: An array that represents all the cells on the grid.
grid.sizeX = 0;
grid.sizeY = 0;
grid.cellArray = [];

// ***** gridInit *****
// Description: Sets the grid size based on user input.
grid.init = function (x, y) {
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
        }
        // Pushes the vertical array into cellArray.
        this.cellArray.push(tempArray);
    }

    $(".floor-plan__div-grid").width(cellUnit * x);
    this.sizeX = x;
    this.sizeY = y;

    // Initialize the titles for images
    for(furniture of item) {
        $(furniture.id).attr('title', `SKU: ${furniture.sku}\nName: ${furniture.name}\nDescription: ${furniture.description}\nPrice: ${"$" + furniture.price}`);
    }

    // Initialize widget functionality
    widget.moveListener();
};





// DOCUMENT READY
$(function() {

    grid.init(10, 10);
    // grid.cellArray[0][0][<property>];
});