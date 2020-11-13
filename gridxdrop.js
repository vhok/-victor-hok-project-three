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
            rotation: 0
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
            rotation: 0
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
            rotation: 0
        },
        deployed: false
}];

const errorCodes = [
    '',
    ''
];

// All the functions you need to manipulate things.
const widget = {};

// Retrieves the selected item on tool widget's corresponding itemArray element.
widget.getActiveItem = () => {
    const itemIdArray = item.map((element) => element.id);
    const itemIndex = itemIdArray.indexOf(`${$('input[name="furniture"]:checked').attr('id')}`);
    return item[itemIndex];
};

widget.translateListener = () => {

};

widget.rotateListener = () => {
    // rotation value meanings:
    // 0 -> 'South'
    // 1 -> 'West'
    // 2 -> 'North'
    // 3 -> 'East'

    // Convert total rotation into one of four values representing direction.
    getRotateReduced = (rotateValue) => rotateValue < 0 ? rotateValue%4 + 4 : rotateValue%4; 
    
    // Convert number value of rotation into letter designation like a compass (N, E, S, W).
    getRotateDirection = (rotateValueReduced) => {
        switch(rotateValueReduced) {
            case 0:
                return 'South';
            case 1:
                return 'West';
            case 2:
                return 'North';
            case 3:
                return 'East';
            default:
        }
    }

    $('#rotate-ccw').on('click', (event) => {
        event.preventDefault();
        const activeItem = widget.getActiveItem();

        if(activeItem) {
            activeItem.position.rotation -= 1;
            const rotationValue = getRotateReduced(activeItem.position.rotation);
            const rotationText = getRotateDirection(rotationValue);

            activeItem.position.rotation = rotationValue;
            $('#direction').val(rotationText);
        }
    });

    $('#rotate-cw').on('click', (event) => {
        event.preventDefault();
        const activeItem = widget.getActiveItem();

        if(activeItem) {
            activeItem.position.rotation += 1;
            const rotationValue = getRotateReduced(activeItem.position.rotation);
            const rotationText = getRotateDirection(rotationValue);

            activeItem.position.rotation = rotationValue;
            $('#direction').val(rotationText);
        }
    });
};

widget.updateFields = () => {
    $('#tool__div-widget input').on('click', () => {
        const activeItem = widget.getActiveItem();
        $('#cell-x').val(activeItem.position.x);
        $('#cell-y').val(activeItem.position.y);
        $('#direction').val(getRotateDirection(activeItem.position.rotation));
    });
};

widget.moveListener = () => {
    $('form').on('submit', function(event) {
        event.preventDefault();
        const xCoord = ( $('#cell-x').val() * cellUnit ) + 'px';
        const yCoord = ( $('#cell-y').val() * cellUnit ) + 'px';

        const activeItem = widget.getActiveItem();

        if(!activeItem.deployed) {
            $(`
            <div class="floor-plan__div-img">
                <img src=${activeItem.url} alt=${activeItem.description}>
            </div>`)
                .appendTo('#floor-plan__div-grid')
                .width(activeItem.sizeX * cellUnit)
                .css('top', xCoord)
                .css('left', yCoord);

            // Sets position object coordinates to match the user input.
            activeItem.position.x = xCoord;
            activeItem.position.y = yCoord;

            // Sets 'deployed to grid' state to true to let widget know that furniture can't be deployed again.
            activeItem.deployed = true;
        } else {
            console.log("can't do that bub");
        }
        


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
        $(furniture.imgId).attr('title', `SKU: ${furniture.sku}\nName: ${furniture.name}\nDescription: ${furniture.description}\nPrice: ${"$" + furniture.price}`);
    }

    // Initialize widget functionality
    widget.updateFields();
    widget.rotateListener();
    widget.moveListener();
};





// DOCUMENT READY
$(function() {

    grid.init(10, 10);
    // grid.cellArray[0][0][<property>];
});