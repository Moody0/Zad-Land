const fs = require('fs');
const xlsx = require('xlsx');

const filePath = "C:\\Users\\moham\\Downloads\\Zad Land\\Zad Land Products.xlsx";

try {
    if (!fs.existsSync(filePath)) {
        console.error("File does not exist at:", filePath);
        process.exit(1);
    }

    const workbook = xlsx.readFile(filePath);
    console.log("Sheet names:", workbook.SheetNames);

    workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
        console.log(`\n--- Sheet: "${sheetName}" ---`);
        console.log(`Total rows: ${data.length}`);
        if (data.length > 0) {
            console.log("Headers (Row 1):", data[0]);
            console.log("Sample Row 2:", data[1]);
            if (data.length > 2) {
                console.log("Sample Row 3:", data[2]);
            }
        }
    });
} catch (error) {
    console.error("Error inspecting excel file:", error);
}
