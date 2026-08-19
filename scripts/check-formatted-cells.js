const xlsx = require('xlsx');

const filePath = "C:\\Users\\moham\\Downloads\\Zad Land\\Zad Land Products.xlsx";
// Read with raw: false or cellNF/cellText to see original formatted text strings in cells!
const workbook = xlsx.readFile(filePath, { raw: false, cellDates: false });
const sheet = workbook.Sheets['Sheet1'];
const formattedData = xlsx.utils.sheet_to_json(sheet);

console.log("=== FORMATTED CELL STRINGS (raw: false) ===");
for (let i = 0; i < 20; i++) {
    const row = formattedData[i];
    console.log(`Row ${i + 2}: Brand: ${row['اسم الماركة']}, Name: ${row['اسم المنتج بالعربي']}, Price: "${row['السعر']}"`);
}

console.log("\n--- Checking Rows around 110-120 with raw: false ---");
for (let i = 108; i <= 120; i++) {
    const row = formattedData[i];
    console.log(`Row ${i + 2}: Price: "${row['السعر']}", Name: ${row['اسم المنتج بالعربي']}`);
}
