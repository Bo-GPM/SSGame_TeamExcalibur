// Simulate the passing of time and growth of crops
function nextDay() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const gardenSheet = ss.getSheetByName('Garden');
  const biomeSheet = ss.getSheetByName('BiomeState');
  const cropSheet = ss.getSheetByName('CropState');

  // Retrieve the current state of biomes and crops
  const biomes = biomeSheet.getRange(1, 1, MAX_ROWS, MAX_COLS).getValues();
  let currentCrops = cropSheet.getRange(1, 1, MAX_ROWS, MAX_COLS).getValues();
  let newCrops = JSON.parse(JSON.stringify(currentCrops)); // Create a deep copy of the current crops

  // Loop to determine the expansion of each crop
  for (let row = 0; row < MAX_ROWS; row++) {
    for (let col = 0; col < MAX_COLS; col++) {
      const cropType = currentCrops[row][col];
      if (STARTING_CROPS.includes(cropType)) {
        // Get the expansion pattern for the current crop type
        const expansionPattern = getExpansionPattern(cropType);

        // Expand crops into adjacent cells based on their expansion pattern
        expansionPattern.forEach(([deltaRow, deltaCol]) => {
          const newRow = row + deltaRow;
          const newCol = col + deltaCol;
          
          // Check if the new position is within the grid boundaries
          if (newRow >= 0 && newRow < MAX_ROWS && newCol >= 0 && newCol < MAX_COLS) {
            // Check for cross-pollination and update the newCrops array accordingly
            if (newCrops[newRow][newCol] === '' || BIOMES.includes(newCrops[newRow][newCol])) {
              newCrops[newRow][newCol] = cropType; // Expand the crop
            } else if (newCrops[newRow][newCol] !== cropType) {
              // Cross-pollination logic to create a new crop type
              newCrops[newRow][newCol] = crossPollinate(newCrops[newRow][newCol], cropType);
            }
          }
        });
      }
    }
  }

  // Update the CropState sheet with new crops
  cropSheet.getRange(1, 1, MAX_ROWS, MAX_COLS).setValues(newCrops);

  // Refresh the visual Garden sheet
  refreshGarden(gardenSheet, biomes, newCrops);
}

function getExpansionPattern(cropType) {
  // Define expansion patterns for each crop type
  const expansionPatterns = {
    'Red': [[-1, 0], [0, 0]], // Example: Red crops expand up
    'Blue': [[0, 0], [0, -1]], // Example: Blue crops expand to the left
    // Define other crop expansion patterns here
  };

  return expansionPatterns[cropType] || [];
}

// Define cross-pollination results
function crossPollinate(crop1, crop2) {
  if ((crop1 === 'Red' && crop2 === 'Blue') || (crop1 === 'Blue' && crop2 === 'Red')) {
    return 'Green'; // Result of cross-pollination
  }
  // Add more cross-pollination rules here
  return crop1; // Default to the original crop if no cross-pollination rule applies
}

// Refresh the visual Garden sheet with crops or biomes
function refreshGarden(gardenSheet, biomes, crops) {
  for (let row = 1; row <= MAX_ROWS; row++) {
    for (let col = 1; col <= MAX_COLS; col++) {
      const cropType = crops[row - 1][col - 1];
      const cell = gardenSheet.getRange(row, col);
      if (cropType) {
        // If there's a crop, set the cell to the crop image
        const imageUrl = CROP_IMAGES[cropType];
        cell.setFormula('=IMAGE("' + imageUrl + '")');
      } else {
        // If there's no crop, set the cell to the biome image
        const biome = biomes[row - 1][col - 1];
        const imageUrl = BIOME_IMAGES[biome];
        cell.setFormula('=IMAGE("' + imageUrl + '")');
      }
    }
  }
}

// Function to plant a crop in a specific cell
function plantCrop(row, column, cropType) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const gardenSheet = ss.getSheetByName('Garden');
  const cropSheet = ss.getSheetByName('CropState');
  const biomeSheet = ss.getSheetByName('BiomeState');

  // Get the current biome and crop state
  const biome = biomeSheet.getRange(row, column).getValue();
  const currentCrop = cropSheet.getRange(row, column).getValue();

  // Check if the cell is empty or contains a biome
  if (currentCrop === '') {
    // Plant the crop: update the CropState and set the image in the garden
    cropSheet.getRange(row, column).setValue(cropType);
    gardenSheet.getRange(row, column).setFormula('=IMAGE("' + CROP_IMAGES[cropType] + '")');
  } else {
    SpreadsheetApp.getUi().alert('There is already a crop here!');
  }
}

// Function to add the selected crop to all selected cells
function addCropsToSelectedCells(cropType) {
  const activeSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const selectedRanges = activeSheet.getActiveRangeList().getRanges();
  
  // Loop through all selected ranges
  selectedRanges.forEach(function(range) {
    const cells = range.getValues();
    
    // Loop through all cells in the current range
    for (let row = 0; row < cells.length; row++) {
      for (let col = 0; col < cells[row].length; col++) {
        // Calculate the actual row and column indices
        const currentRow = range.getRow() + row;
        const currentColumn = range.getColumn() + col;
        // Plant the crop if the cell contains a biome or is empty
        plantCrop(currentRow, currentColumn, cropType);
      }
    }
  });
}