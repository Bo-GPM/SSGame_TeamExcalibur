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
  'Green': 'https://i.pinimg.com/564x/9f/3a/53/9f3a532573fecdb5ae60cc983e6ec7c1.jpg', // Replace with the URL of our green crop image
  // Add more crop types and their image URLs here
};
const BIOME_IMAGES = {
  'Dirt': 'https://i.pinimg.com/564x/e7/41/05/e74105dbd3a1c477d9895d411122b2d1.jpg', // Replace with the URL of our dirt biome image
  'Stone': 'https://i.pinimg.com/564x/68/c1/48/68c14808181067247a9d0e6f0024f08d.jpg', // Replace with the URL of our stone biome image
  // Add more biome types and their image URLs here
};

// Check if a crop is compatible with a biome for growth
function isCompatibleBiome(cropType, biome) {
  // Define compatibility rules here...
  // For simplicity, all crops are compatible with all biomes in this example
  return true;
}