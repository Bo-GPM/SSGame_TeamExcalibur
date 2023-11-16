// Simulate the passing of time and growth of crops
function nextDay() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const gardenSheet = ss.getSheetByName('Garden');
  const biomeSheet = ss.getSheetByName('BiomeState');
  const cropSheet = ss.getSheetByName('CropState');
  const newRemainingDays = getRemainingDays() - 1;
  //PropertiesService.getScriptProperties().setProperty('remainingDays', newRemainingDays.toString());
  setRemainingDays(newRemainingDays);
  if (getRemainingDays()< 1) {
    SpreadsheetApp.getUi().alert('You ran out of days. You lose!');
    return;
  }
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
        //PROBLEM PROBLEM!
        //const expansionPattern = getExpansionPattern(cropType, row, col,newCrops);
        const expansionPattern = getExpansionPattern(cropType);

        // Expand crops into adjacent cells based on their expansion pattern
        expansionPattern.forEach(([deltaRow, deltaCol]) => {
          const newRow = row + deltaRow;
          const newCol = col + deltaCol;

          // Check if the new position is within the grid boundaries
          if (newRow >= 0 && newRow < MAX_ROWS && newCol >= 0 && newCol < MAX_COLS) {
            // Check for cross-pollination and update the newCrops array accordingly
            if (newCrops[newRow][newCol] === '' || BIOMES.includes(newCrops[newRow][newCol])) {
              //check if the crop can grow on the selected space cross polination can override the biome
              if (getValidGrowthSpace(cropType, biomes[newRow][newCol])) {
                newCrops[newRow][newCol] = cropType; // Expand the crop
                calculateCropsNumber(cropType, true, false);
              }
            } else if (newCrops[newRow][newCol] !== cropType) {
              // Cross-pollination logic to create a new crop type
              var newCropType = crossPollinate(newCrops[newRow][newCol], cropType);
              // decrease replaced crops nums
              calculateCropsNumber(newCrops[newRow][newCol], false, true);
              newCrops[newRow][newCol] = newCropType;
              // increase new crop num
              calculateCropsNumber(newCropType, true, false);
            }
          }
        });
      }
    }
    //updateSidebar();
  }

  // Update the CropState sheet with new crops
  cropSheet.getRange(1, 1, MAX_ROWS, MAX_COLS).setValues(newCrops);

  // Refresh the visual Garden sheet
  refreshGarden(gardenSheet, biomes, newCrops);
  checkGameState();
}

function getExpansionPattern(cropType) {
  // Define expansion patterns for each crop type
  // Row and column input are there to add functionality for complicated growth patterns like parasitism and symbiosis in the future
  const expansionPatterns = {
    'Red': [[0, 1]], // Example: Red crops expand up and right
    'Blue': [[0, -1]], // Example: Blue crops expand to the left and down
    'Green': [[-1, 1], [1, -1]], //green crop spreads in all directions
    'Yellow':[[1,1],[-1,-1]],
    'Pink':[[1,0]],
    'Orange':[[-1,0]]
    //Complex crop code for later!
    //'Pink': pinkGrowth(row,column,currentCrops),
    // Define other crop expansion patterns here
  };

  return expansionPatterns[cropType] || [];
}

//returns true if a plant can grow on the designated biome, cross polination overides biome restrictions
function getValidGrowthSpace(crop, space) {
  const validSpace = {
    'Red': ['Dirt'], //Example red can grow on dirt
    'Blue': ['Dirt'],
    'Green': ['Stone'],
    'Pink' : ['Dirt'],
    'Yellow': ['Dirt'],
    'Orange': ['Dirt']
  }
  if (validSpace[crop].includes(space)) {
    return true;
  }
  else {
    return false;
  }


// Define cross-pollination results
function crossPollinate(crop1, crop2) {
  if ((crop1 === 'Yellow' && crop2 === 'Blue') || (crop1 === 'Blue' && crop2 === 'Yellow')) {
    return 'Green'; // Result of cross-pollination
  }
    if ((crop1 === 'Pink' && crop2 === 'Blue') || (crop1 === 'Pink' && crop2 === 'Green') ||
   (crop1 === 'Blue' && crop2 === 'Pink') || (crop1 === 'Green' && crop2 === 'Pink')
  ) {
    return 'Pink';
  }
    if ((crop1 === 'Red' && crop2 === 'Yellow') || (crop1 === 'Yellow' && crop2 === 'Red')) {
    return 'Orange'; // Result of cross-pollination
  }
      if ((crop1 === 'Red' && crop2 === 'Blue') || (crop1 === 'Blue' && crop2 === 'Red')) {
    return 'Pink'; // Result of cross-pollination
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
        const asset = CROP_IMAGES[cropType];
        asset.copyTo(cell, SpreadsheetApp.CopyPasteType.PASTE_NORMAL, false);
        //const imageUrl = CROP_IMAGES[cropType];
        //cell.setFormula('=IMAGE("' + imageUrl + '")');
      } else {
        // If there's no crop, set the cell to the biome image
        const biome = biomes[row - 1][col - 1];
        //const imageUrl = BIOME_IMAGES[biome];
        //cell.setFormula('=IMAGE("' + imageUrl + '")');
        const asset = BIOME_IMAGES[biome];
        asset.copyTo(cell, SpreadsheetApp.CopyPasteType.PASTE_NORMAL, false);
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


  if (getRemainingCrops() <= 0) {
    SpreadsheetApp.getUi().alert('You have no more crops to plant.');
    return;
  }

  // Get the current biome and crop state
  const biome = biomeSheet.getRange(row, column).getValue();
  const currentCrop = cropSheet.getRange(row, column).getValue();

  // Check if the cell is empty or contains a biome
  if (currentCrop === '') {
    // Plant the crop: update the CropState and set the image in the garden
    cropSheet.getRange(row, column).setValue(cropType);
    const newRemainingCrops = getRemainingCrops() - 1;
    //PropertiesService.getScriptProperties().setProperty('remainingCrops', newRemainingCrops.toString());
    setRemainingCrops(newRemainingCrops);
    const asset = CROP_IMAGES[cropType];
    asset.copyTo(gardenSheet.getRange(row, column), SpreadsheetApp.CopyPasteType.PASTE_NORMAL, false);
    //gardenSheet.getRange(row, column).setFormula('=IMAGE("' + CROP_IMAGES[cropType] + '")');
    updateSidebar();
  } else {
    SpreadsheetApp.getUi().alert('There is already a crop here!');
    return;
  }
  calculateCropsNumber(cropType, true, false);

  checkGameState();
}

// Helper function to get the remaining crops and remaining days
function getRemainingCrops() {
  //return parseInt(PropertiesService.getScriptProperties().getProperty('remainingCrops'), 10);
  return parseInt(remainingCrops.getValue());
}

function setRemainingCrops(value) {
  remainingCrops.setValue(value);
  updateInGameUI("Remaining Crops",value.toString());
}

function getRemainingDays() {
  //return parseInt(PropertiesService.getScriptProperties().getProperty('remainingDays'), 10);
  return parseInt(remainingDays.getValue());
}

function setRemainingDays(value){
  remainingDays.setValue(value);
  updateInGameUI("Remaining Days",value.toString());
}
// Function to add the selected crop to all selected cells
function addCropsToSelectedCells(cropType) {
  //const remainingCrops = PropertiesService.getScriptProperties().getProperty('remainingCrops');

  if (getRemainingCrops() <= 0) {
    SpreadsheetApp.getUi().alert('You have no more crops to plant.');
    return;
  }

  if (cropType === 'None') {
    SpreadsheetApp.getUi().alert('No crops are selected!');
    return;
  }
  const activeSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const selectedRanges = activeSheet.getActiveRangeList().getRanges();

  // Loop through all selected ranges
  selectedRanges.forEach(function (range) {
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

  //const newRemainingCrops = getRemainingCrops()  - countPlantedCrops; // Calculate the neSw count
  //PropertiesService.getScriptProperties().setProperty('remainingCrops', newRemainingCrops);
  
  // Update the sidebar to reflect the new remaining crop count
  //updateSidebar();
}

function checkGameState() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const gameStateSheet = ss.getSheetByName('GameState');
  const cropTypeRange = gameStateSheet.getRange("A1:A6");
  const cropNumRange = gameStateSheet.getRange("B1:B6");
  const cropGoalRange = gameStateSheet.getRange("C1:C6");

  const numRows = cropTypeRange.getNumRows();
  const numCols = cropTypeRange.getNumColumns();

  for (let i = 1; i <= numRows; i++) {
    for (let j = 1; j <= numCols; j++) {
      const currentCropNum = cropNumRange.getCell(i, j);
      const currentCropGoal = cropGoalRange.getCell(i, j);
      if (parseInt(currentCropNum.getValue()) < parseInt(currentCropGoal.getValue())) return;

    }
  }
  SpreadsheetApp.getUi().alert('You win!');
}


function calculateCropsNumber(cropType, increase, decrease) {

  const numRows = cropTypeRange.getNumRows();
  const numCols = cropTypeRange.getNumColumns();

  for (let i = 1; i <= numRows; i++) {
    for (let j = 1; j <= numCols; j++) {
      const currentCell = cropTypeRange.getCell(i, j);

      if (currentCell.getValue() != cropType) continue;

      var numCell = cropNumRange.getCell(i, j);
      if (increase) {
        var value = (parseInt(numCell.getValue()) + 1);
      }
      else if (decrease) {
        var value = (parseInt(numCell.getValue()) - 1);
      }
      numCell.setValue(value);

      updateInGameUI(cropType,value.toString());
    }
  }
  //SpreadsheetApp.getUi().alert(scriptProperties.getProperty(cropType));
}
