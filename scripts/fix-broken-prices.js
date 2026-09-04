const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const zedPath = 'C:/Users/moham/Downloads/زاد لاند.xlsx';
const backupPath = 'C:/Users/moham/Downloads/زاد لاند_backup.xlsx';
const varPath = 'C:/Users/moham/Downloads/داتا شركات متنوعة.xlsx';

const cleanStr = s => (s || '').replace(/\s+/g, ' ').trim();

function decodeDatePrice(serial, fmt) {
    const date = new Date(Math.round((serial - 25569) * 86400 * 1000));
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    if (fmt === 'mm.dd') {
        const dayStr = day < 10 ? `0${day}` : `${day}`;
        return parseFloat(`${month}.${dayStr}`);
    }
    return parseFloat(`${month}.${day}`);
}

async function fixPrices() {
    console.log('--- Step 1: Backup Excel file ---');
    fs.copyFileSync(zedPath, backupPath);
    console.log(`Backed up to: ${backupPath}`);

    console.log('\n--- Step 2: Load Reference Data ---');
    const wbVar = XLSX.readFile(varPath);
    const dataVar = XLSX.utils.sheet_to_json(wbVar.Sheets[wbVar.SheetNames[0]]);
    const varMap = new Map();
    dataVar.forEach(r => {
        const key = cleanStr(r['اسم المنتج بالعربي']);
        if (key && r['السعر'] !== undefined && !isNaN(Number(r['السعر']))) {
            varMap.set(key, Number(r['السعر']));
        }
    });
    console.log(`Loaded ${varMap.size} valid price entries from داتا شركات متنوعة.xlsx`);

    console.log('\n--- Step 3: Inspect and Fix زاد لاند.xlsx ---');
    const wbZad = XLSX.readFile(zedPath, { cellNF: true });
    const sheetName = wbZad.SheetNames[0];
    const ws = wbZad.Sheets[sheetName];
    const dataZad = XLSX.utils.sheet_to_json(ws);

    // Identify header row and price column
    const range = XLSX.utils.decode_range(ws['!ref']);
    let priceColIdx = -1;
    let nameArColIdx = -1;

    for (let C = range.s.c; C <= range.e.c; ++C) {
        const headerCell = ws[XLSX.utils.encode_cell({ r: range.s.r, c: C })];
        if (headerCell && cleanStr(headerCell.v) === 'السعر') {
            priceColIdx = C;
        }
        if (headerCell && cleanStr(headerCell.v) === 'اسم المنتج بالعربي') {
            nameArColIdx = C;
        }
    }

    console.log(`Column index - NameAr: ${nameArColIdx}, Price: ${priceColIdx}`);

    const fixes = [];

    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        const nameCell = ws[XLSX.utils.encode_cell({ r: R, c: nameArColIdx })];
        const priceCell = ws[XLSX.utils.encode_cell({ r: R, c: priceColIdx })];

        if (!nameCell || !priceCell) continue;

        const rawPrice = Number(priceCell.v);
        const nameAr = cleanStr(nameCell.v);

        if (!isNaN(rawPrice) && rawPrice > 100) {
            let correctPrice = null;
            let source = '';

            // Check if present in varMap
            if (varMap.has(nameAr)) {
                correctPrice = varMap.get(nameAr);
                source = 'داتا شركات متنوعة';
            } else {
                // Decode from date serial
                correctPrice = decodeDatePrice(rawPrice, priceCell.z);
                source = `Decoded Date (${priceCell.z || 'm.d'})`;
            }

            // Update worksheet cell
            priceCell.v = correctPrice;
            priceCell.t = 'n';
            priceCell.z = '0.00';
            delete priceCell.w;

            fixes.push({
                row: R + 1,
                nameAr,
                oldPrice: rawPrice,
                newPrice: correctPrice,
                source
            });
        }
    }

    console.log(`Found and fixed ${fixes.length} broken prices in Excel.`);
    console.log('Sample fixes:');
    fixes.slice(0, 10).forEach(f => {
        console.log(`  Row ${f.row}: [${f.nameAr}] ${f.oldPrice} -> $${f.newPrice} (${f.source})`);
    });

    console.log('\n--- Step 4: Save updated Excel file ---');
    XLSX.writeFile(wbZad, zedPath);
    console.log(`Saved updated Excel to: ${zedPath}`);

    // Verify written file
    const wbVerify = XLSX.readFile(zedPath);
    const dataVerify = XLSX.utils.sheet_to_json(wbVerify.Sheets[wbVerify.SheetNames[0]]);
    const remainingBroken = dataVerify.filter(r => Number(r['السعر']) > 100);
    console.log(`Verification: Remaining broken prices in زاد لاند.xlsx: ${remainingBroken.length}`);

    console.log('\n--- Step 5: Update Database via Prisma ---');
    let dbUpdated = 0;
    let dbNotFound = 0;

    for (const fix of fixes) {
        // Find by nameAr
        const dbProduct = await prisma.product.findFirst({
            where: {
                OR: [
                    { nameAr: fix.nameAr },
                    { nameAr: { contains: fix.nameAr } }
                ]
            }
        });

        if (dbProduct) {
            await prisma.product.update({
                where: { id: dbProduct.id },
                data: { price: fix.newPrice }
            });
            dbUpdated++;
        } else {
            console.log(`  [WARN] Not found in DB: ${fix.nameAr}`);
            dbNotFound++;
        }
    }

    console.log(`Database update complete. Updated: ${dbUpdated}, Not found: ${dbNotFound}`);

    // Verify DB
    const dbBrokenRemaining = await prisma.product.count({
        where: { price: { gt: 100 } }
    });
    console.log(`Verification: Remaining products in DB with price > 100: ${dbBrokenRemaining}`);
}

fixPrices()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
