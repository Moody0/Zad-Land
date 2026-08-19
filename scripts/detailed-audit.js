const xlsx = require('xlsx');

const filePath = "C:\\Users\\moham\\Downloads\\Zad Land\\Zad Land Products.xlsx";
const workbook = xlsx.readFile(filePath);
const sheet = workbook.Sheets['Sheet1'];
const rawData = xlsx.utils.sheet_to_json(sheet);

console.log("=== DETAILED ANOMALIES INSPECTION ===");

// 1. Missing / Invalid Prices
console.log("\n--- Sample Missing / Invalid Prices ---");
const missingPrices = [];
rawData.forEach((row, idx) => {
    const price = row['السعر'] || row['Price'];
    const name = row['اسم المنتج بالعربي'] || row['اسم المنتج بالإنجليزي'];
    const brand = row['اسم الماركة'];
    if (price === undefined || price === null || price === '' || isNaN(Number(price)) || Number(price) <= 0) {
        missingPrices.push({ row: idx + 2, brand, name, price });
    }
});
console.log(`Total missing/invalid price rows: ${missingPrices.length}`);
console.log("Sample 10 rows without price:", missingPrices.slice(0, 10));

// 2. Missing Images
console.log("\n--- Sample Missing Images ---");
const missingImgs = [];
rawData.forEach((row, idx) => {
    const img1 = row['رابط صورة المنتج'];
    const img2 = row['صورة مفرق'];
    const name = row['اسم المنتج بالعربي'] || row['اسم المنتج بالإنجليزي'];
    const brand = row['اسم الماركة'];
    if (!img1 && !img2) {
        missingImgs.push({ row: idx + 2, brand, name });
    }
});
console.log(`Total missing images rows: ${missingImgs.length}`);
console.log("Sample 10 rows without image:", missingImgs.slice(0, 10));

// 3. Category & Brand normalizations needed
console.log("\n--- Category & Brand Spelling Variations ---");
const brandCounts = {};
const mainCatCounts = {};
rawData.forEach(row => {
    const b = row['اسم الماركة'];
    const m = row['القسم الرئيسي'];
    if (b) brandCounts[b] = (brandCounts[b] || 0) + 1;
    if (m) mainCatCounts[m] = (mainCatCounts[m] || 0) + 1;
});
console.log("Brand distribution:", brandCounts);
console.log("Main Category distribution:", mainCatCounts);
