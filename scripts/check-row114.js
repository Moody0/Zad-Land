const xlsx = require('xlsx');

const filePath = "C:\\Users\\moham\\Downloads\\Zad Land\\Zad Land Products.xlsx";
const workbook = xlsx.readFile(filePath);
const sheet = workbook.Sheets['Sheet1'];
const rawData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

console.log("=== OTTIMA ROWS AROUND ROW 114 ===");
for (let i = 108; i <= 120; i++) {
    console.log(`Row ${i + 1}:`, rawData[i]);
}
