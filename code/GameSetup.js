// Add custom menu on spreadsheet open
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Game')
    .addItem('Start Game', 'startGame')
    .addItem('Next Day', 'nextDay')
    // .addItem('Show Main Menu', 'showMainMenu')
    .addToUi();

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let mainMenuSheet = ss.getSheetByName('MainMenu');
  if (!mainMenuSheet) {
      mainMenuSheet = ss.insertSheet('MainMenu');
      // You might want to set up your main menu here if it's the first time creating it
  }
  mainMenuSheet.showSheet();
  mainMenuSheet.activate();
  
  // Hide the Garden sheet initially
  let gardenSheet = ss.getSheetByName('Garden');
  if (gardenSheet) {
    gardenSheet.hideSheet();
  }
}

// // Main Menu Initialization, wasted due to Google's Security Protocal 
// function showMainMenu() {
//   const html = HtmlService.createHtmlOutputFromFile('MainMenu')
//     .setWidth(1024)
//     .setHeight(768);
//   SpreadsheetApp.getUi().showModalDialog(html, 'Main Menu');
// }

// Start the game and set up the initial state
function startGame() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const gardenSheet = ss.getSheetByName('Garden') || ss.insertSheet('Garden');
  
  // Hide the MainMenu sheet
  const mainMenuSheet = ss.getSheetByName('MainMenu');
  if (mainMenuSheet) {
    mainMenuSheet.hideSheet();
  }

  gardenSheet.activate(); // Make the Garden sheet the active one

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

// Populate the garden with biome images
function populateGardenWithBiomes(gardenSheet, biomeSheet) {
  const biomes = biomeSheet.getRange(1, 1, MAX_ROWS, MAX_COLS).getValues();
  for (let i = 1; i <= MAX_ROWS; i++) {
    for (let j = 1; j <= MAX_COLS; j++) {
      let biome = biomes[i - 1][j - 1];
      let imageUrl = BIOME_IMAGES[biome];
      gardenSheet.getRange(i, j).setFormula('=IMAGE("' + imageUrl + '")');
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