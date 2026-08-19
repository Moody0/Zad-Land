const xlsx = require('xlsx');

const filePath = "C:\\Users\\moham\\Downloads\\Zad Land\\Zad Land Products.xlsx";
const workbook = xlsx.readFile(filePath);
const sheet = workbook.Sheets['Sheet1'];
const rawData = xlsx.utils.sheet_to_json(sheet);

function parsePrice(rawVal, rowIdx) {
    if (rawVal === undefined || rawVal === null || rawVal === '' || rawVal === 0 || rawVal === '0') {
        return 0;
    }

    // If string like "2.31.93"
    if (typeof rawVal === 'string') {
        const cleaned = rawVal.trim();
        if (cleaned === '2.31.93') {
            return 2.31;
        }
        if (cleaned.split('.').length > 2) {
            const parts = cleaned.split('.');
            return parseFloat(`${parts[0]}.${parts[1]}`) || 0;
        }
        const num = parseFloat(cleaned);
        if (!isNaN(num)) {
            rawVal = num;
        } else {
            return 0;
        }
    }

    // Check if it's an Excel Date Serial number (roughly 45000 - 47000 for year 2023-2027)
    if (typeof rawVal === 'number' && rawVal >= 44000 && rawVal <= 48000) {
        // Convert Excel serial date to JS Date: (serial - (25567 + 2)) * 86400 * 1000
        const date = new Date(Math.round((rawVal - 25569) * 86400 * 1000));
        const month = date.getUTCMonth() + 1; // e.g. 2 for Feb
        const day = date.getUTCDate(); // e.g. 7
        // In date input, typing "2.70" became Month 2, Day 7 or Day 2, Month 7
        // Let's reconstruct the decimal price:
        // E.g. month=2, day=7 -> 2.70
        // month=2, day=5 -> 2.50
        // month=1, day=8 -> 1.80
        // month=3, day=24 -> 3.24
        // month=3, day=31 -> 3.31
        const priceStr = `${month}.${day < 10 ? day * 10 : day}`;
        return parseFloat(`${month}.${day}`);
    }

    if (typeof rawVal === 'number' && !isNaN(rawVal)) {
        return Number(rawVal);
    }

    return 0;
}

console.log("=== PRICE PARSING VERIFICATION ON ALL 378 ROWS ===");
let zeroPriceCount = 0;
let validPriceCount = 0;

rawData.forEach((row, idx) => {
    const rawPrice = row['السعر'];
    const parsed = parsePrice(rawPrice, idx + 2);
    if (parsed === 0) {
        zeroPriceCount++;
    } else {
        validPriceCount++;
    }
    if (idx < 25 || idx === 112 || idx === 113) {
        console.log(`Row ${idx + 2} [${row['اسم الماركة']}]: "${rawPrice}" -> $${parsed.toFixed(2)}`);
    }
});

console.log(`\nValid Prices (> 0): ${validPriceCount}`);
console.log(`Zero Prices (0): ${zeroPriceCount}`);
