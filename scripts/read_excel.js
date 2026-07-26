const xlsx = require('xlsx');
const path = "C:\\Users\\moham\\Downloads\\عطور روبي بيوتي.xlsx";

try {
  const workbook = xlsx.readFile(path);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  console.log("=== Sheet Name ===");
  console.log(sheetName);
  console.log("\n=== First 10 Rows ===");
  data.slice(0, 10).forEach((row, i) => {
    console.log(`Row ${i + 1}:`, row);
  });
} catch(e) {
  console.error("Error reading excel file:", e);
}
