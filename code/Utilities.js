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
  'Red': 'https://via.placeholder.com/50/ff4d4d', // Replace with the URL of your red crop image
  'Blue': 'https://via.placeholder.com/50/4d4dff', // Replace with the URL of your blue crop image
  // Add more crop types and their image URLs here
};

// Check if a crop is compatible with a biome for growth
function isCompatibleBiome(cropType, biome) {
  // Define compatibility rules here...
  // For simplicity, all crops are compatible with all biomes in this example
  return true;
}