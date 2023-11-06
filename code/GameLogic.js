// Simulate the passing of time and growth of crops
function nextDay() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const gardenSheet = ss.getSheetByName('Garden');
  const biomeSheet = ss.getSheetByName('BiomeState');
  const cropSheet = ss.getSheetByName('CropState');

  // Get the current state of biomes and crops
  const biomes = biomeSheet.getRange(1, 1, MAX_ROWS, MAX_COLS).getValues();
  const currentCrops = cropSheet.getRange(1, 1, MAX_ROWS, MAX_COLS).getValues();
  let newCrops = Array(MAX_ROWS).fill().map(() => Array(MAX_COLS).fill(''));

  // Loop to determine the new position of each crop
  for (let row = 0; row < MAX_ROWS; row++) {
    for (let col = 0; col < MAX_COLS; col++) {
      const cropType = currentCrops[row][col];
      if (cropType) {
        // Determine the new position based on the crop type
        // This is where you implement your game's growth logic
        // For example, if the crop moves to the right:
        let newRow = row;
        let newCol = (col + 1) % MAX_COLS;
        
        // Check if the new position is valid and empty
        if (!newCrops[newRow][newCol]) {
          newCrops[newRow][newCol] = cropType;
        }
      }
    }
  }

  // Update the CropState sheet with new crops
  cropSheet.getRange(1, 1, MAX_ROWS, MAX_COLS).setValues(newCrops);

  // Refresh the visual Garden sheet
  for (let row = 1; row <= MAX_ROWS; row++) {
    for (let col = 1; col <= MAX_COLS; col++) {
      const cropType = newCrops[row - 1][col - 1];
      if (cropType) {
        const imageUrl = CROP_IMAGES[cropType];
        gardenSheet.getRange(row, col).setFormula('=IMAGE("' + imageUrl + '")');
      } else {
        // If there's no crop, set the cell to the biome background
        const biome = biomes[row - 1][col - 1];
        let color = (biome === 'Dirt') ? '#f4e4bc' : '#c2c2c2';
        gardenSheet.getRange(row, col).setBackground(color).clearContent();
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