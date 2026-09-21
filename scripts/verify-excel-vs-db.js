const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');

const prisma = new PrismaClient();
const filePath = 'C:\\Users\\moham\\Downloads\\زاد لاند نهائي .xlsx';

function text(value) {
    return value === undefined || value === null ? '' : String(value).replace(/\s+/g, ' ').trim();
}

function normalizeBrand(raw) {
    const value = text(raw);
    if (!value) return '';
    if (value === 'اميركانا') return 'امريكانا';
    if (value === 'غرومت') return 'غورمت';
    if (value === 'ريربي') return 'ديربي';
    return value;
}

function normalizeMainCategory(raw) {
    const value = text(raw);
    if (value === 'مفزرات') return 'مفرزات';
    return value;
}

function parsePrice(value) {
    if (value === undefined || value === null || value === '') return 0;
    if (typeof value === 'number' && value >= 44000 && value <= 48000) {
        const date = new Date(Math.round((value - 25569) * 86400 * 1000));
        return Number((date.getUTCMonth() + 1) + '.' + date.getUTCDate());
    }
    const raw = text(value).replace(/[^0-9.\-]/g, '');
    if (!raw) return 0;
    const parts = raw.split('.');
    if (parts.length > 2) return Number(parts[0] + '.' + parts[1]) || 0;
    return Number(raw) || 0;
}

function parseStock(value) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? Math.max(0, Math.round(number)) : 0;
}

function validImage(value) {
    const candidate = text(value);
    return candidate && candidate !== '0' && (/^https?:\/\//i.test(candidate) || candidate.startsWith('/'))
        ? candidate
        : null;
}

async function main() {
    const workbook = XLSX.readFile(filePath, { cellDates: false });
    const sheetName = workbook.SheetNames[0];
    const excelRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: null, raw: true });
    
    console.log(`Excel file sheet: ${sheetName}, rows: ${excelRows.length}`);

    const dbProducts = await prisma.product.findMany({
        include: {
            brand: true,
            category: true,
            mainCategory: true,
        },
        orderBy: { createdAt: 'asc' }
    });

    console.log(`DB products count: ${dbProducts.length}`);

    // Map DB products by multiple potential keys to check matching:
    const dbByNameAr = new Map();
    const dbByNameEn = new Map();
    const dbByExactBoth = new Map();

    for (const p of dbProducts) {
        if (p.nameAr) {
            if (!dbByNameAr.has(p.nameAr)) dbByNameAr.set(p.nameAr, []);
            dbByNameAr.get(p.nameAr).push(p);
        }
        if (p.nameEn) {
            if (!dbByNameEn.has(p.nameEn)) dbByNameEn.set(p.nameEn, []);
            dbByNameEn.get(p.nameEn).push(p);
        }
        const key = `${p.nameAr || ''}:::${p.nameEn || ''}`;
        if (!dbByExactBoth.has(key)) dbByExactBoth.set(key, []);
        dbByExactBoth.get(key).push(p);
    }

    let priceMismatches = [];
    let stockMismatches = [];
    let nameMismatches = [];
    let descMismatches = [];
    let imageMismatches = [];
    let optionMismatches = [];
    let categoryMismatches = [];
    let brandMismatches = [];
    let missingInDb = [];
    let matchedDbIds = new Set();

    excelRows.forEach((row, idx) => {
        const rowNum = idx + 2;
        const nameAr = text(row['اسم المنتج بالعربي']);
        const nameEn = text(row['اسم المنتج بالإنجليزي']) || nameAr;
        const descAr = text(row['وصف المنتج بالعربي']) || nameAr;
        const descEn = text(row['وصف المنتج بالإنجليزي']) || nameEn;
        const excelPrice = parsePrice(row['السعر']);
        const excelStock = parseStock(row['الكمية']);
        const excelBrand = normalizeBrand(row['اسم الماركة']);
        const excelMainCat = normalizeMainCategory(row['القسم الرئيسي']);
        const excelSubCat = text(row['القسم الفرعي']);
        const excelOptions = text(row['الخيارات']) || null;
        const imgList = [validImage(row['رابط صورة المنتج']), validImage(row['__EMPTY'])].filter(Boolean);
        const excelImages = imgList.length ? imgList.join(',') : '/placeholder.svg';

        // Find candidate product in DB
        let candidates = dbByExactBoth.get(`${nameAr}:::${nameEn}`);
        if (!candidates || candidates.length === 0) {
            candidates = dbByNameAr.get(nameAr);
        }
        if (!candidates || candidates.length === 0) {
            candidates = dbByNameEn.get(nameEn);
        }

        if (!candidates || candidates.length === 0) {
            missingInDb.push({ rowNum, nameAr, nameEn, excelPrice, excelStock });
            return;
        }

        // Pick candidate not yet matched
        let matched = candidates.find(c => !matchedDbIds.has(c.id)) || candidates[0];
        matchedDbIds.add(matched.id);

        const dbPrice = Number(matched.price);
        const dbStock = matched.stock;

        // Check price
        if (Math.abs(dbPrice - excelPrice) > 0.001) {
            priceMismatches.push({
                rowNum,
                nameAr,
                excelPrice,
                dbPrice,
                diff: dbPrice - excelPrice
            });
        }

        // Check stock
        if (dbStock !== excelStock) {
            stockMismatches.push({
                rowNum,
                nameAr,
                excelStock,
                dbStock
            });
        }

        // Check names
        if (matched.nameAr !== nameAr || matched.nameEn !== nameEn) {
            nameMismatches.push({
                rowNum,
                excelNameAr: nameAr,
                dbNameAr: matched.nameAr,
                excelNameEn: nameEn,
                dbNameEn: matched.nameEn
            });
        }

        // Check descriptions
        if (matched.descriptionAr !== descAr || matched.descriptionEn !== descEn) {
            descMismatches.push({
                rowNum,
                nameAr,
                excelDescAr: descAr,
                dbDescAr: matched.descriptionAr,
                excelDescEn: descEn,
                dbDescEn: matched.descriptionEn
            });
        }

        // Check images
        if (matched.images !== excelImages) {
            imageMismatches.push({
                rowNum,
                nameAr,
                excelImages,
                dbImages: matched.images
            });
        }

        // Check options
        if (matched.options !== excelOptions) {
            optionMismatches.push({
                rowNum,
                nameAr,
                excelOptions,
                dbOptions: matched.options
            });
        }

        // Check Brand
        const dbBrand = matched.brand?.name || '';
        if (excelBrand && !dbBrand.includes(excelBrand)) {
            brandMismatches.push({
                rowNum,
                nameAr,
                excelBrand,
                dbBrand
            });
        }

        // Check Main Category
        const dbMainCat = matched.mainCategory?.name || '';
        if (excelMainCat && dbMainCat !== excelMainCat) {
            categoryMismatches.push({
                rowNum,
                nameAr,
                type: 'mainCategory',
                excel: excelMainCat,
                db: dbMainCat
            });
        }

        // Check Sub Category
        const dbSubCat = matched.category?.name || '';
        if (excelSubCat && dbSubCat !== excelSubCat) {
            categoryMismatches.push({
                rowNum,
                nameAr,
                type: 'subCategory',
                excel: excelSubCat,
                db: dbSubCat
            });
        }
    });

    const extraInDb = dbProducts.filter(p => !matchedDbIds.has(p.id));

    console.log('\n=== DETAILED FIELD AUDIT RESULTS ===');
    console.log(`Total Excel rows: ${excelRows.length}`);
    console.log(`Total DB products: ${dbProducts.length}`);
    console.log(`Matched DB records: ${matchedDbIds.size}`);
    console.log(`Missing in DB from Excel: ${missingInDb.length}`);
    console.log(`Extra in DB not matched to Excel: ${extraInDb.length}`);
    console.log(`Price mismatches: ${priceMismatches.length}`);
    console.log(`Stock mismatches (pieces per carton): ${stockMismatches.length}`);
    console.log(`Name mismatches (Arabic & English): ${nameMismatches.length}`);
    console.log(`Description mismatches: ${descMismatches.length}`);
    console.log(`Images mismatches: ${imageMismatches.length}`);
    console.log(`Options mismatches: ${optionMismatches.length}`);
    console.log(`Brand mismatches: ${brandMismatches.length}`);
    console.log(`Category mismatches: ${categoryMismatches.length}`);

    if (descMismatches.length > 0) {
        console.log('\nSample Desc mismatches:', JSON.stringify(descMismatches.slice(0, 3), null, 2));
    }
    if (imageMismatches.length > 0) {
        console.log('\nSample Image mismatches:', JSON.stringify(imageMismatches.slice(0, 3), null, 2));
    }
    if (optionMismatches.length > 0) {
        console.log('\nSample Option mismatches:', JSON.stringify(optionMismatches.slice(0, 3), null, 2));
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
