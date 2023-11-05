// Define constants for the game
const MAX_ROWS = 10;
const MAX_COLS = 10;
const ROW_HEIGHT = 80; // Set the desired height
const COLUMN_WIDTH = 80; // Set the desired width
const STARTING_CROPS = ['Red', 'Blue'];
const BIOMES = ['Dirt', 'Stone'];
const CROP_COLORS = {
  'Red': '#ff4d4d',
  'Blue': '#4d4dff',
  'Green': '#4dff4d'
};
const CROP_IMAGES = {
  'Red': 'https://i.pinimg.com/originals/a2/49/7b/a2497b54049c2a8daa4d81f92e447879.png', // Replace with the URL of our red crop image
  'Blue': 'https://i.pinimg.com/originals/eb/d9/48/ebd94802a5a8dcedbf84f14df026688e.jpg', // Replace with the URL of our blue crop image
  // Add more crop types and their image URLs here
};

// Show sidebar for crop selection
function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Crop Selection')
      .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
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

// Function to plant a crop in a specific cell
function plantCrop(row, column, cropType) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const imageUrl = CROP_IMAGES[cropType];

  if (imageUrl) {
    const cell = sheet.getRange(row, column);
    const cellValue = cell.getValue().toString().trim();
    
    // Check if the cell contains a biome or is empty
    if (cellValue === '' || BIOMES.includes(cellValue)) {
      // Using the IMAGE formula to set an image in the cell
      cell.setFormula('=IMAGE("' + imageUrl + '")');
    } else {
      SpreadsheetApp.getUi().alert('There is already a crop here!');
    }
  } else {
    SpreadsheetApp.getUi().alert('Please select a crop type.');
  }
}

// Add custom menu on spreadsheet open
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Game')
    .addItem('Start Game', 'startGame')
    .addItem('Next Day', 'nextDay')
    .addToUi();
}

// Function to initialize the garden with proper cell sizes for images
function initializeGarden() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  // Set the desired height and width
  sheet.setRowHeights(1, MAX_ROWS, ROW_HEIGHT);
  sheet.setColumnWidths(1, MAX_COLS, COLUMN_WIDTH);
}

// Start the game and set up the initial state
function startGame() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clear(); // Clear the garden for a new game
  initializeBiomes(); // Set up biomess
  showSidebar(); // Show crop selection and instructions sidebar
  initializeGarden(); //Set up Garden's dimension
  // Additional game setup...
}

// Function to set the selected crop in the script properties
function setSelectedCrop(cropType) {
  PropertiesService.getScriptProperties().setProperty('selectedCrop', cropType);
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
  const formulas = range.getFormulas();
  const backgrounds = range.getBackgrounds();

  let growthPlans = [];
  
  // Collect growth plans based on existing crop formulas
  for (let i = 0; i < formulas.length; i++) {
    for (let j = 0; j < formulas[i].length; j++) {
      let formula = formulas[i][j];
      let background = backgrounds[i][j];
      if (formula && formula.startsWith('=IMAGE("')) {
        let cropType = extractCropTypeFromFormula(formula);
        if (cropType) {
          let growthDirection = Math.floor(Math.random() * 4); // 0: up, 1: right, 2: down, 3: left
          growthPlans.push({ row: i + 1, col: j + 1, type: cropType, direction: growthDirection });
        }
      }
    }
  }

  // Execute the growth plans
  growthPlans.forEach(function(plan) {
    let newRow = plan.row + getRowOffset(plan.direction);
    let newCol = plan.col + getColumnOffset(plan.direction);

    // Check boundaries and biome compatibility
    if (newRow > 0 && newRow <= MAX_ROWS && newCol > 0 && newCol <= MAX_COLS) {
      let targetCellFormula = sheet.getRange(newRow, newCol).getFormula();
      let targetCellBackground = sheet.getRange(newRow, newCol).getBackground();
      
      // Check if the target cell is empty or has a biome background
      if (!targetCellFormula && BIOMES.includes(targetCellBackground)) {
        let imageUrl = CROP_IMAGES[plan.type];
        sheet.getRange(newRow, newCol).setFormula('=IMAGE("' + imageUrl + '")');
      }
    }
  });
}

// Helper function to extract crop type from image formula
function extractCropTypeFromFormula(formula) {
  let imageUrl = formula.match(/=IMAGE\("([^"]+)"\)/)[1];
  return Object.keys(CROP_IMAGES).find(type => CROP_IMAGES[type] === imageUrl);
}

// Helper functions to get row and column offsets based on growth direction
function getRowOffset(direction) {
  // 0: up, 1: right, 2: down, 3: left
  if (direction === 0) return -1;
  if (direction === 2) return 1;
  return 0;
}

function getColumnOffset(direction) {
  // 0: up, 1: right, 2: down, 3: left
  if (direction === 1) return 1;
  if (direction === 3) return -1;
  return 0;
}

// Check if a crop is compatible with a biome for growth
function isCompatibleBiome(cropType, biome) {
  // Define compatibility rules here...
  // For simplicity, all crops are compatible with all biomes in this example
  return true;
}
