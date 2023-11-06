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
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const gardenSheet = ss.getSheetByName('Garden') || ss.insertSheet('Garden');
  
  // Clear the garden visual sheet
  gardenSheet.clear();
  gardenSheet.clearFormats();
  setGardenSize(gardenSheet); // Ensure the garden is set to the right size

  // Initialize or clear the BiomeState and CropState sheets
  let biomeSheet = ss.getSheetByName('BiomeState');
  let cropSheet = ss.getSheetByName('CropState');

  if (!biomeSheet) {
    biomeSheet = ss.insertSheet('BiomeState');
    biomeSheet.hideSheet();
  } else {
    biomeSheet.clear();
  }

  if (!cropSheet) {
    cropSheet = ss.insertSheet('CropState');
    cropSheet.hideSheet();
  } else {
    cropSheet.clear();
  }

  // Set up the biomes and crops
  initializeBiomes(biomeSheet);
  initializeCrops(cropSheet);
  populateGardenWithBiomes(gardenSheet, biomeSheet);

  // Show the sidebar with crop selection
  showSidebar(); 
}

// Initialize biomes randomly on the grid in the BiomeState sheet
function initializeBiomes(biomeSheet) {
  const biomes = [];
  for (let i = 0; i < MAX_ROWS; i++) {
    const row = [];
    for (let j = 0; j < MAX_COLS; j++) {
      let biome = BIOMES[Math.floor(Math.random() * BIOMES.length)];
      row.push(biome);
    }
    biomes.push(row);
  }
  biomeSheet.getRange(1, 1, MAX_ROWS, MAX_COLS).setValues(biomes);
}

// Initialize the CropState sheet with empty strings
function initializeCrops(cropSheet) {
  const crops = [];
  for (let i = 0; i < MAX_ROWS; i++) {
    const row = [];
    for (let j = 0; j < MAX_COLS; j++) {
      row.push('');
    }
    crops.push(row);
  }
  cropSheet.getRange(1, 1, MAX_ROWS, MAX_COLS).setValues(crops);
}

// Populate the garden with biome colors
function populateGardenWithBiomes(gardenSheet, biomeSheet) {
  const biomes = biomeSheet.getRange(1, 1, MAX_ROWS, MAX_COLS).getValues();
  for (let i = 1; i <= MAX_ROWS; i++) {
    for (let j = 1; j <= MAX_COLS; j++) {
      let biome = biomes[i - 1][j - 1];
      let color = (biome === 'Dirt') ? '#f4e4bc' : '#c2c2c2';
      gardenSheet.getRange(i, j).setBackground(color);
    }
  }
}

// Function to set the size of the garden sheet
function setGardenSize(sheet) {
  for (let i = 1; i <= MAX_ROWS; i++) {
    sheet.setRowHeight(i, ROW_HEIGHT);
  }
  for (let j = 1; j <= MAX_COLS; j++) {
    sheet.setColumnWidth(j, COLUMN_WIDTH);
  }
}