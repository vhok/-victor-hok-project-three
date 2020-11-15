// ******* GLOBAL VARIABLES *******

// IMPORTANT: The of cellUnit must be in sync with _variables.scss $form__input-cell-unit for uniformity between CSS and JS.
const cellUnit = 50;

// Length of the grid in x and y
const gridLengthX = 10;
const gridLengthY = 10;

// cellArray: An array that represents all the cells on the grid. 
// element of cellArray -> { occupied: <boolean>, {jQuery object representing cell div} }
cellArray = [];

// An array 'item' containing all furniture objects.
const items = [{
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

// Error codes mainly for accessibility users that can't experience full visualization and may require other forms of feedback. These are printed to output field in widget.
const errorCodes = [
    'object out of bounds',
    'collision with object',
    'item already deployed'
];

// ******* NAMESPACE & METHODS *******

// widget: namespace for all user interaction based methods (majority of methods kept under this namespace).
const widget = {};

// ******* METHODS *******
// .getActiveItem(): Retrieves the object from itemArray that corresponds to currently selected item on widget.
widget.getActiveItem = () => {
    const itemsIdArray = items.map((element) => element.id);
    const itemIndex = itemsIdArray.indexOf(`${$('input[name="furniture"]:checked').attr('id')}`);
    return items[itemIndex];
};

// .getRotateValueReduced(): Converts total rotation value into one of four values representing the item's direction.
widget.getRotateValueReduced = (rotateValue) => rotateValue < 0 ? rotateValue % 4 + 4 : rotateValue % 4; 

// .getRotateDirection(): Converts number value of rotation into letter designation like a compass (N, E, S, W).
// rotation value meanings:
// 0 -> 'South'
// 1 -> 'West'
// 2 -> 'North'
// 3 -> 'East'
widget.getRotateDirection = (rotateValueReduced) => {
    switch (rotateValueReduced) {
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

// .isCollision(): Returns true of argument item collides with an existing one on the grid.
widget.isCollision = (itemCheckCollides, xCheckCollides, yCheckCollides) => {
    const isNeutralOrientation = itemCheckCollides.position.rotation % 2 === 0;
    const xLength = isNeutralOrientation ? itemCheckCollides.sizeX : itemCheckCollides.sizeY;
    const yLength = isNeutralOrientation ? itemCheckCollides.sizeY : itemCheckCollides.sizeX;

    // Never allow the array to search outside the grid.
    const xToCheck = (xCheckCollides + xLength - 1 < gridLengthX) ? xCheckCollides + xLength : gridLengthX - 1;
    const yToCheck = (yCheckCollides + yLength - 1 < gridLengthY) ? yCheckCollides + yLength : gridLengthY - 1;

    for(i = xCheckCollides; i < xToCheck; i++) {
        for(j = yCheckCollides; j < yToCheck; j++) {
            if(cellArray[i][j]['occupied']) return true;
        }
    }

    return false;
};

// .isOutOfBounds(): Returns true if object is out of bounds.
widget.isOutOfBounds = (itemCheckBounds, xCheckBounds, yCheckBounds) => {
    const isNeutralOrientation = itemCheckBounds.position.rotation % 2 === 0;
    const xLength = isNeutralOrientation ? itemCheckBounds.sizeX : itemCheckBounds.sizeY;
    const yLength = isNeutralOrientation ? itemCheckBounds.sizeY : itemCheckBounds.sizeX;

    // Only need to check right and bottom grid wall because user isn't able to enter negative values.
    return xCheckBounds + xLength > gridLengthX || yCheckBounds + yLength > gridLengthY;
};

// ******* EVENT LISTENER METHODS *******

// .updateFieldsListener(): 
widget.updatetFieldsListener = () => {
    $('#tool__form-widget .furniture').on('click', () => {
        const activeItem = widget.getActiveItem();
        $('#form__input-cell-x').val(activeItem.position.x);
        $('#form__input-cell-y').val(activeItem.position.y);
        $('#form__input-direction').val(widget.getRotateDirection(activeItem.position.rotation));
    });
};

widget.translateListener = () => {
    // $('.form__input-cell-x')
};

widget.rotateListener = () => {
    $('#rotate-ccw').on('click', (event) => {
        event.preventDefault();
        const activeItem = widget.getActiveItem();

        if(activeItem) {
            activeItem.position.rotation -= 1;
            const rotationValue = widget.getRotateValueReduced(activeItem.position.rotation);
            const rotationText = widget.getRotateDirection(rotationValue);

            activeItem.position.rotation = rotationValue;
            $('#form__input-direction').val(rotationText);
        }
    });

    $('#rotate-cw').on('click', (event) => {
        event.preventDefault();
        const activeItem = widget.getActiveItem();

        if(activeItem) {
            activeItem.position.rotation += 1;
            const rotationValue = widget.getRotateValueReduced(activeItem.position.rotation);
            const rotationText = widget.getRotateDirection(rotationValue);

            activeItem.position.rotation = rotationValue;
            $('#form__input-direction').val(rotationText);
        }
    });
};

// submit action for item placement.
widget.moveListener = () => {
    $('form').on('submit', function(event) {
        const activeItem = widget.getActiveItem();

        event.preventDefault();

        if(activeItem && !activeItem.deployed) {            

            const xProposed = parseInt($('#form__input-cell-x').val());
            const yProposed = parseInt($('#form__input-cell-y').val());
            
            // Check if the grid is clear of objects or active item is within bounds before placing activeItem.
            const isOutOfBounds = widget.isOutOfBounds(activeItem, xProposed, yProposed);
            const isCollision = widget.isCollision(activeItem, xProposed, yProposed);

            if (!(isOutOfBounds || isCollision)) {

                // Update all remaining fields in the item object.
                activeItem.deployed = true;
                activeItem.position.x = xProposed;
                activeItem.position.y = yProposed;
                $('#form__input-output').val('');

                // Updates cellArray coordinates to let the program know those cells are occupied by an item.
                const isNeutralOrientation = activeItem.position.rotation % 2 === 0;
                const xLength = isNeutralOrientation ? activeItem.sizeX : activeItem.sizeY;
                const yLength = isNeutralOrientation ? activeItem.sizeY : activeItem.sizeX;

                for (i = activeItem.position.x; i < activeItem.position.x + xLength; i++) {
                    for (j = activeItem.position.y; j < activeItem.position.y + yLength; j++) {
                        cellArray[i][j]['occupied'] = true;
                    }
                }

                // Sets position object coordinates to match the user input.
                const xTransform = (xProposed * cellUnit);
                const yTransform = (yProposed * cellUnit);

                // Sets rotational value.
                let rotateTransform = '';

                if (activeItem.position.rotation === 1) {
                    rotateTransform = `translateX(${activeItem.sizeY * cellUnit}px) rotate(${activeItem.position.rotation * 90}deg)`;
                } else if (activeItem.position.rotation === 2) {
                    rotateTransform = `translate(${activeItem.sizeX * cellUnit}px, ${activeItem.sizeY * cellUnit}px) rotate(${activeItem.position.rotation * 90}deg)`;
                } else if (activeItem.position.rotation === 3) {
                    rotateTransform = `translateY(${activeItem.sizeX * cellUnit}px) rotate(${activeItem.position.rotation * 90}deg)`;
                } else {
                    rotateTransform = '';
                }

                $(`
            <div class="floor-plan__div-img" id=${activeItem.id}>
                <img src=${activeItem.url} alt=${activeItem.description}>
            </div>`)
                    .appendTo("#floor-plan__div-grid")
                    .width(activeItem.sizeX * cellUnit)
                    .css("left", xTransform + 'px')
                    .css("top", yTransform + 'px')
                    .css("transform", rotateTransform);
            } else if(isCollision && isOutOfBounds) {
                // Collision and out of bounds error.
                $('#form__input-output').val(`Error: ${errorCodes[1]} & ${errorCodes[0]}`);
            } else if (isCollision) {
                // Collision error.
                $('#form__input-output').val(`Error: ${errorCodes[1]}`);
            } else {
                // Out of bounds error.
                $('#form__input-output').val(`Error: ${errorCodes[0]}`);
            }
            

        } else {
            // Already deployed error.
            $('#form__input-output').val(`Error: ${errorCodes[2]}`);
        }
        
    });
};

// ******* MAIN APP NAMESPACE *******
const grid = {};
// grid properties
// sizeX: The horizontal length of the grid in units of "cells".
// sizeY: The vertical length of the grid in units of "cells".
grid.sizeX = 0;
grid.sizeY = 0;

// // ******* INIT METHOD *******

// .init(): Sets the grid size based on user input.
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
        cellArray.push(tempArray);
    }

    $(".floor-plan__div-grid").width(cellUnit * x);
    this.sizeX = x;
    this.sizeY = y;

    // Limit the input size to prevent errors
    $('#form__input-cell-x').attr('max', gridLengthX - 1);
    $('#form__input-cell-y').attr('max', gridLengthY - 1);

    // Initialize the titles for images
    for(furniture of items) {
        $(furniture.imgId).attr('title', `SKU: ${furniture.sku}\nName: ${furniture.name}\nDescription: ${furniture.description}\nPrice: ${"$" + furniture.price}`);
    }

    // Initialize widget functionality
    widget.updatetFieldsListener();
    widget.rotateListener();
    widget.moveListener();
};



// DOCUMENT READY
$(function() {
    grid.init(gridLengthX, gridLengthY);
});