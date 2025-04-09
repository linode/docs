function importCSVFromDrive() {
  // The name of the CSV file in Google Drive
  var fileName = 'urls.csv'; // Replace with your actual file name if different

  try {
    // Fetch the file from Google Drive
    var files = DriveApp.getFilesByName(fileName);

    if (files.hasNext()) {
      var file = files.next();
      var csvContent = file.getBlob().getDataAsString();

      // Ensure that the CSV content is not empty
      if (!csvContent) {
        throw new Error('The CSV file is empty or could not be read.');
      }

      // Parse the CSV content
      var csvData = Utilities.parseCsv(csvContent);

      // Check if parsed data is non-empty
      if (csvData.length === 0) {
        throw new Error('Parsed CSV data is empty.');
      }

      // Get the active sheet
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

      // Clear existing content on the sheet
      sheet.clear();

      // Set the values to the sheet starting at A1
      sheet.getRange(1, 1, csvData.length, csvData[0].length).setValues(csvData);
    } else {
      throw new Error("File not found with the name: " + fileName);
    }
  } catch (e) {
    Logger.log('Failed to import CSV: ' + e.toString());
    SpreadsheetApp.getUi().alert('Failed to import the CSV file: ' + e.toString());
  }
}
