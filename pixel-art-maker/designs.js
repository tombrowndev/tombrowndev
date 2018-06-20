// GLobal
const sizeForm = document.getElementById('sizePicker');
const canvas = document.getElementById('pixelCanvas');
let penIsActive = eraserIsActive = false;

// Make the grid
function makeGrid(event) {

	// Prevent the form from submitting
	event.preventDefault();

	// Remove existing elemernts from the cavas table
	while(canvas.firstChild) {
		canvas.removeChild(canvas.firstChild);
	}

	// Get the width and height height values for making the grid
	let gridHeight = document.getElementById('inputHeight').value;
	let gridWidth = document.getElementById('inputWidth').value;

	// Reset the form
	this.reset();

	// Fragment for containing the new rows
	var newRows = document.createDocumentFragment();

	// Loop through rows
	for(let i = 0; i < gridHeight; i++) {

		// Create a row
		let row = document.createElement('tr');

		// Loop through columns
		for(let j = 0; j < gridWidth; j++) {

			// Create a column
			let column = document.createElement('td');

			// Append columns to the row
			row.appendChild(column);

		}

		// Append rows to the frgment
		newRows.appendChild(row);

	}

	// Append the fragment to the canvas table
	canvas.appendChild(newRows);

}

// Paint to the canvas
function draw(e) {

	// Prevent default behaviour
	e.preventDefault();

	// Check if target is a cell
	if(e.target.nodeName == 'TD' && (penIsActive || eraserIsActive)) {

		let color;

		if(penIsActive) {

			// Read the color from the picker
			color = document.getElementById('colorPicker').value;

		} else if (eraserIsActive) {

			// Set color to null for eraser
			color = null;

		}

		// Apply color to cell background
		e.target.style.backgroundColor = color;

	}

}

function enableDrawing(e) {

	// Active the pen
	if(e.button === 0) penIsActive = true;

	// Activate the eraser
	if(e.button === 2) eraserIsActive = true;

}

function disableDrawing() {

	penIsActive = eraserIsActive = false;

}

// Submit grid maker form
sizePicker.addEventListener('submit', makeGrid);

// Enables pen or erasor
canvas.addEventListener('mousedown', enableDrawing);

// Disables pen and eraser if buttons are released
document.addEventListener('mouseup', disableDrawing);

// Disables pen and eraser if ouse leaves the canvas
canvas.addEventListener('mouseleave', disableDrawing);

// Paint or Erase to canvas (click)
canvas.addEventListener('mousedown', draw);

// Paint or Erase to canvas (drag)
canvas.addEventListener('mouseover', draw);

// Prevent context menu in canvas
canvas.addEventListener('contextmenu', event => event.preventDefault());