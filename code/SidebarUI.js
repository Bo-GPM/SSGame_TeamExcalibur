// Show sidebar for crop selection
function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Crop Selection')
      .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}

// Function to set the selected crop in the script properties
function setSelectedCrop(cropType) {
  PropertiesService.getScriptProperties().setProperty('selectedCrop', cropType);
}