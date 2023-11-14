function updateInGameUI(key, value) {
  if (key == "Level") {
    levelUI.setValue(key + " " + value.toString);
    return;
  }
  if (key == "Remaining Crops") {
    remainingCropsUI.setRichTextValue(SpreadsheetApp.newRichTextValue()
      .setText(key + ":" + value)
      .setTextStyle(16, 18, SpreadsheetApp.newTextStyle()
        .setForegroundColor('#ffff00')
        .build())
      .build());
    return;
  }

  if (key == "Remaining Days") {

    remainingDaysUI.setRichTextValue(SpreadsheetApp.newRichTextValue()
      .setText(key + ":" + value)
      .setTextStyle(15, 16, SpreadsheetApp.newTextStyle()
        .setForegroundColor('#ffff00')
        .build())
      .build());
    return;
  }
  const numRows = cropsNumberUI.getNumRows();
  const numCols = cropsNumberUI.getNumColumns();
  //var levelText = inGameUI.getCell(1, 1).getValue();
  //var remaingCropsText = inGameUI.getCell(2, 2).getValue();
  //var remaingDaysText = inGameUI.getCell(2, 2).getValue();
  for (let i = 1; i <= numRows; i++) {
    for (let j = 1; j <= numCols; j++) {
      const currentCell = cropsNumberUI.getCell(i, j);
      var field = currentCell.getValue().toString().split(':');
      var title = field[0];
      //SpreadsheetApp.getUi().alert(title);
      var valueText = field[1].split("/")[0];
      var goalText = field[1].split('/')[1];
      if (key === title) {
        currentCell.setValue(title + ":" + value + "/" + goalText);
        currentCell.setRichTextValue(SpreadsheetApp.newRichTextValue()
          .setText(title + ":" + value + "/" + goalText)
          .setTextStyle(title.length + 1, title.length + 2, SpreadsheetApp.newTextStyle()
            .setForegroundColor('#ff0000')
            .build())
          .build());
      }
      //SpreadsheetApp.getUi().alert(title + valueText + goalText);
    }
  }
}


function initInGameUI() {
  assetsSheet.getRange('I1:I10').copyTo(gardenSheet.getRange("K1"), SpreadsheetApp.CopyPasteType.PASTE_NORMAL, false);
}