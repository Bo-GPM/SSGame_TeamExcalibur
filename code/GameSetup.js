// Add custom menu on spreadsheet open
function onOpen() {
  resetGame();
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Game')
    .addItem('Start Game', 'startGame')
    .addItem('Next Day', 'nextDay')
    // .addItem('Show Main Menu', 'showMainMenu')
    .addToUi();

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let mainMenuSheet = ss.getSheetByName('MainMenu');
  mainMenuSheet.showSheet();
  mainMenuSheet.activate();
  
  // Hide the Garden sheet initially
  let gardenSheet = ss.getSheetByName('Garden');
  if (gardenSheet) {
    gardenSheet.hideSheet();
  }
}

function resetGame(){
  // reset collected crops numbers
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  //const gameStateSheet = ss.getSheetByName('GameState');

  //const remaingCrops = gameStateSheet.getRange('B9');
  const numRows = cropNumRange.getNumRows();
  const numCols = cropNumRange.getNumColumns();
  remainingCrops.setValue(REMAININGCROPS);
  remainingDays.setValue(REMAINGDAYS);
  for (let i = 1; i <= numRows; i++) {
    for (let j = 1; j <= numCols; j++) {
      const currentCell = cropNumRange.getCell(i, j);
      currentCell.setValue(0);
    }
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
  resetGame();
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const gardenSheet = ss.getSheetByName('Garden') || ss.insertSheet('Garden');
  
  // Hide the MainMenu sheet
  
  const mainMenuSheet = ss.getSheetByName('MainMenu');

  gardenSheet.activate(); // Make the Garden sheet the active one
  if (mainMenuSheet) {
    gardenSheet.showSheet();
    mainMenuSheet.hideSheet();
  }

  // Clear the garden visual sheet
  gardenSheet.clear();
  gardenSheet.clearFormats();
  setGardenSize(gardenSheet); // Ensure the garden is set to the right size
  initInGameUI();
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
  PropertiesService.getScriptProperties().setProperty('remainingCrops', INITIAL_CROP_COUNT);

  //Set the day counter
  PropertiesService.getScriptProperties().setProperty('remainingDays', INITIAL_DAY_COUNT);

  // Show the sidebar with crop selection
  showSidebar(); 

  updateSidebar();

}

// Add a function to update the sidebar with the remaining crop count
function updateSidebar() {
  const remainingCrops = PropertiesService.getScriptProperties().getProperty('remainingCrops');
  const htmlTemplate = HtmlService.createTemplateFromFile('Sidebar');
  htmlTemplate.remainingCrops = remainingCrops;

  const remainingDays = PropertiesService.getScriptProperties().getProperty('remainingDays');
  htmlTemplate.remainingDays = remainingDays;
  
  const html = htmlTemplate.evaluate().setTitle('Crop Selection').setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}

// Initialize biomes randomly on the grid in the BiomeState sheet
function initializeBiomes(biomeSheet) {
  const biomes = [];
  for (let i = 0; i < MAX_ROWS; i++) {
    const row = [];
    for (let j = 0; j < MAX_COLS; j++) {
      let biome = BIOMES[Math.floor(Math.random() * BIOMES.length)];
      if(biome != 0)
      {
        biome = BIOMES[Math.floor(Math.random() * BIOMES.length)];
      }
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
      //let imageUrl = BIOME_IMAGES[biome];
      //gardenSheet.getRange(i, j).setFormula('=IMAGE("' + imageUrl + '")');
      const asset = BIOME_IMAGES[biome];
      //const imageUrl = BIOME_IMAGES[biome];
      asset.copyTo(gardenSheet.getRange(i, j), SpreadsheetApp.CopyPasteType.PASTE_NORMAL, false)
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