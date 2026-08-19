const xlsx = require('xlsx');

const filePath = "C:\\Users\\moham\\Downloads\\Zad Land\\Zad Land Products.xlsx";
const workbook = xlsx.readFile(filePath);
const sheet = workbook.Sheets['Sheet1'];
const rawData = xlsx.utils.sheet_to_json(sheet);

console.log("=== EXCEL DATA DEEP AUDIT ===");
console.log(`Total Products Count: ${rawData.length}`);

const mainCategories = new Set();
const subCategories = new Set();
const brands = new Set();
const optionsFound = [];
let missingNameAr = 0;
let missingNameEn = 0;
let missingPrice = 0;
let invalidPrice = 0;
let missingImage = 0;
let twoImagesCount = 0;
let duplicateNames = {};

rawData.forEach((row, idx) => {
    const mainCat = row['القسم الرئيسي'] || row['Main Category'];
    const subCat = row['القسم الفرعي'] || row['Sub Category'];
    const brand = row['اسم الماركة'] || row['Brand Name'];
    const nameAr = row['اسم المنتج بالعربي'] || row['Name ar'];
    const nameEn = row['اسم المنتج بالإنجليزي'] || row['Name en'];
    const descAr = row['وصف المنتج بالعربي'] || row['description ar'];
    const descEn = row['وصف المنتج بالإنجليزي'] || row['description en'];
    const price = row['السعر'] || row['Price'];
    const qty = row['الكمية'] || row['Quantity'];
    const options = row['الخيارات'] || row['Options'];
    const img1 = row['رابط صورة المنتج'] || row['Images'] || row['Image'];
    const img2 = row['صورة مفرق'];

    if (mainCat) mainCategories.add(String(mainCat).trim());
    if (subCat) subCategories.add(String(subCat).trim());
    if (brand) brands.add(String(brand).trim());
    if (options && String(options).trim()) optionsFound.push({ name: nameAr || nameEn, options });

    if (!nameAr) missingNameAr++;
    if (!nameEn) missingNameEn++;
    if (price === undefined || price === null || price === '') missingPrice++;
    else if (isNaN(Number(price)) || Number(price) <= 0) invalidPrice++;

    if (!img1 && !img2) missingImage++;
    if (img1 && img2) twoImagesCount++;

    const key = (nameAr || nameEn || `row-${idx}`).trim();
    duplicateNames[key] = (duplicateNames[key] || 0) + 1;
});

console.log(`\nUnique Main Categories (${mainCategories.size}):`, Array.from(mainCategories));
console.log(`\nUnique Brands (${brands.size}):`, Array.from(brands));
console.log(`\nUnique Sub Categories (${subCategories.size}):`, Array.from(subCategories));

console.log("\n--- Validation Statistics ---");
console.log(`Missing Name (Arabic): ${missingNameAr}`);
console.log(`Missing Name (English): ${missingNameEn}`);
console.log(`Missing Price: ${missingPrice}`);
console.log(`Invalid Price: ${invalidPrice}`);
console.log(`Missing Images: ${missingImage}`);
console.log(`Rows with 2 images (Carton + Single item): ${twoImagesCount}`);
console.log(`Rows with Options/Variants: ${optionsFound.length}`);
if (optionsFound.length > 0) {
    console.log("Sample Options:", optionsFound.slice(0, 5));
}

const duplicates = Object.entries(duplicateNames).filter(([k, count]) => count > 1);
console.log(`Duplicate product titles: ${duplicates.length}`);
if (duplicates.length > 0) {
    console.log("Sample duplicates:", duplicates.slice(0, 5));
}
