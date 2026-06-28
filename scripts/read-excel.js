const xlsx = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '..', 'ruby beauty chinieses FINAL.xlsx');
const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet);

console.log("Headers:");
if (data.length > 0) {
    console.log(Object.keys(data[0]));
    console.log("First row:");
    console.log(data[0]);
} else {
    console.log("File is empty.");
}
