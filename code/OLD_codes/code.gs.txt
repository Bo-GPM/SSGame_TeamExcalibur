// Define constants for the game
const MAX_ROWS = 10;
const MAX_COLS = 10;
const STARTING_CROPS = ['Red', 'Blue'];
const BIOMES = ['Dirt', 'Stone'];
const CROP_COLORS = {
  'Red': '#ff4d4d',
  'Blue': '#4d4dff',
  'Green': '#4dff4d'
};

// Add custom menu on spreadsheet open
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Game')
    .addItem('Start Game', 'startGame')
    .addItem('Next Day', 'nextDay')
    .addToUi();
}

// Start the game and set up the initial state
function startGame() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clear(); // Clear the garden for a new game
  initializeBiomes(); // Set up biomess
  // Additional game setup...
}

// Initialize biomes randomly on the grid
function initializeBiomes() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  for (let i = 1; i <= MAX_ROWS; i++) {
    for (let j = 1; j <= MAX_COLS; j++) {
      let biome = BIOMES[Math.floor(Math.random() * BIOMES.length)];
      let color = (biome === 'Dirt') ? '#f4e4bc' : '#c2c2c2'; // Light brown for Dirt, grey for Stone
      sheet.getRange(i, j).setBackground(color).setValue(biome);
    }
  }
}

// Simulate the passing of time and growth of crops
function nextDay() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getDataRange();
  const values = range.getValues();

  // Growth and spreading logic here...
  // For simplicity, we'll just randomly grow existing crops in any direction
  // and handle cross-pollination creating a green crop
  
  // First, find all crops and plan their growth
  let growthPlans = [];
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < values[i].length; j++) {
      let cellValue = values[i][j];
      if (STARTING_CROPS.includes(cellValue)) {
        let growthDirection = Math.floor(Math.random() * 4); // 0: up, 1: right, 2: down, 3: left
        growthPlans.push({ row: i, col: j, type: cellValue, direction: growthDirection });
      }
    }
  }

  // Execute the growth plans
  for (let plan of growthPlans) {
    let newRow = plan.row;
    let newCol = plan.col;
    switch (plan.direction) {
      case 0: newRow--; break; // up
      case 1: newCol++; break; // right
      case 2: newRow++; break; // down
      case 3: newCol--; break; // left
    }

    // Check boundaries and biome compatibility
    if (newRow >= 0 && newRow < MAX_ROWS && newCol >= 0 && newCol < MAX_COLS) {
      let currentBiome = sheet.getRange(newRow + 1, newCol + 1).getValue();
      if (isCompatibleBiome(plan.type, currentBiome)) {
        // Handle cross-pollination
        let existingCrop = values[newRow][newCol];
        if (STARTING_CROPS.includes(existingCrop) && existingCrop !== plan.type) {
          // Cross-pollination occurs, creating a green crop
          sheet.getRange(newRow + 1, newCol + 1).setValue('Green').setBackground(CROP_COLORS['Green']);
        } else if (existingCrop !== 'Green') {
          // Normal growth occurs
          sheet.getRange(newRow + 1, newCol + 1).setValue(plan.type).setBackground(CROP_COLORS[plan.type]);
        }
      }
    }
  }
}

// Check if a crop is compatible with a biome for growth
function isCompatibleBiome(cropType, biome) {
  // Define compatibility rules here...
  // For simplicity, all crops are compatible with all biomes in this example
  return true;
}
// Bind planting functionality to a cell double-click via onEdit trigger
function onEdit(e) {
  const range = e.range;
  const sheet = range.getSheet();
  if (sheet.getName() === 'Garden' && range.getColumn() <= MAX_COLS && range.getRow() <= MAX_ROWS) {
    // Check if the cell is empty or not
    if (range.getValue() === '') {
      // Show a dialog to select the crop type
      const ui = SpreadsheetApp.getUi();
      const response = ui.prompt('Plant Crop', 'Enter crop type (Red or Blue):', ui.ButtonSet.OK_CANCEL);

      if (response.getSelectedButton() === ui.Button.OK) {
        let cropType = response.getResponseText();
        if (STARTING_CROPS.includes(cropType)) {
          range.setValue(cropType).setBackground(CROP_COLORS[cropType]);
        } else {
          ui.alert('Invalid crop type.');
        }
      }
    } else {
      ui.alert('There is already a plant here!');
    }
  }
}
