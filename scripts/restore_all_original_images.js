const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const crypto = require('crypto');
const sharp = require('sharp');
const { PrismaClient } = require('@prisma/client');
const xlsx = require('xlsx');

const prisma = new PrismaClient();
const excelPath = 'C:\\Users\\moham\\Downloads\\Zad Land\\Zad Land Products.xlsx';
const uploadsDir = path.join(__dirname, '../public/uploads/products');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

function downloadBuffer(url, retries = 3) {
    return new Promise((resolve, reject) => {
        if (!url || !url.startsWith('http')) {
            return reject(new Error('Invalid URL'));
        }

        const client = url.startsWith('https') ? https : http;
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Referer': 'https://postimages.org/'
            },
            timeout: 10000
        };

        const req = client.get(url, options, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return downloadBuffer(res.headers.location, retries - 1).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                if (retries > 0) {
                    setTimeout(() => downloadBuffer(url, retries - 1).then(resolve).catch(reject), 1000);
                } else {
                    reject(new Error(`HTTP ${res.statusCode} for ${url}`));
                }
                return;
            }

            const chunks = [];
            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks)));
            res.on('error', reject);
        });

        req.on('error', (err) => {
            if (retries > 0) {
                setTimeout(() => downloadBuffer(url, retries - 1).then(resolve).catch(reject), 1000);
            } else {
                reject(err);
            }
        });

        req.on('timeout', () => {
            req.destroy();
            if (retries > 0) {
                setTimeout(() => downloadBuffer(url, retries - 1).then(resolve).catch(reject), 1000);
            } else {
                reject(new Error(`Timeout downloading ${url}`));
            }
        });
    });
}

function normalizeName(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .replace(/[\u064B-\u065F\u0670]/g, '') // remove arabic diacritics
        .replace(/[^\w\u0600-\u06FF]/g, '')
        .trim();
}

async function main() {
    console.log('🚀 Reading original Excel file:', excelPath);
    if (!fs.existsSync(excelPath)) {
        console.error('❌ Excel file not found!');
        return;
    }

    const wb = xlsx.readFile(excelPath);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);
    console.log(`📊 Loaded ${rows.length} rows from Excel`);

    // Fetch all products from DB
    const dbProducts = await prisma.product.findMany();
    console.log(`📦 Found ${dbProducts.length} products in DB`);

    let restoredCount = 0;
    let failedCount = 0;
    let alreadyValidCount = 0;

    for (const p of dbProducts) {
        // Check if this product has test-sample.webp, placeholder.svg, or a broken image
        const isBadImage = !p.images || 
            p.images.includes('test-sample.webp') || 
            p.images === '/placeholder.svg' || 
            p.images === '';

        // Find matching row in Excel
        const normPNameEn = normalizeName(p.nameEn || p.name);
        const normPNameAr = normalizeName(p.nameAr);

        const match = rows.find(r => {
            const rEn = normalizeName(r['اسم المنتج بالإنجليزي'] || r['Name En'] || r['Name']);
            const rAr = normalizeName(r['اسم المنتج بالعربي'] || r['Name Ar']);
            return (rEn && rEn === normPNameEn) || (rAr && (rAr === normPNameAr || rAr === normPNameEn));
        });

        if (match) {
            const rawUrl = match['رابط صورة المنتج'] || match['صورة مفرق'] || match['Images'] || match['Image'];
            if (rawUrl && typeof rawUrl === 'string' && rawUrl.startsWith('http')) {
                // If it's a bad image or not yet converted to dedicated webp
                if (isBadImage || !p.images.startsWith('/uploads/products/prod-')) {
                    try {
                        const hash = crypto.createHash('md5').update(rawUrl).digest('hex').substring(0, 10);
                        const fileName = `prod-${hash}.webp`;
                        const destPath = path.join(uploadsDir, fileName);
                        const localRelPath = `/uploads/products/${fileName}`;

                        if (!fs.existsSync(destPath)) {
                            process.stdout.write(`📥 Downloading [${p.name}] from ${rawUrl} ... `);
                            const buf = await downloadBuffer(rawUrl);
                            const webpBuf = await sharp(buf).webp({ quality: 85 }).toBuffer();
                            fs.writeFileSync(destPath, webpBuf);
                            console.log(`✅ (${webpBuf.length} bytes)`);
                        }

                        await prisma.product.update({
                            where: { id: p.id },
                            data: { images: localRelPath }
                        });

                        restoredCount++;
                    } catch (err) {
                        console.error(`❌ Failed to download for [${p.name}] (${rawUrl}):`, err.message);
                        // If download fails, keep the original remote URL instead of test-sample.webp!
                        await prisma.product.update({
                            where: { id: p.id },
                            data: { images: rawUrl }
                        });
                        failedCount++;
                    }
                } else {
                    alreadyValidCount++;
                }
            } else {
                if (isBadImage) {
                    // No URL in excel, set to neutral placeholder
                    await prisma.product.update({
                        where: { id: p.id },
                        data: { images: '/placeholder.svg' }
                    });
                }
            }
        }
    }

    // Clean up any remaining test-sample.webp in DB
    const remainingTestSample = await prisma.product.findMany({
        where: { images: { contains: 'test-sample.webp' } }
    });

    for (const p of remainingTestSample) {
        await prisma.product.update({
            where: { id: p.id },
            data: { images: '/placeholder.svg' }
        });
    }

    // Also remove test-sample.webp from disk so it's impossible to use by mistake
    const testSampleFile = path.join(uploadsDir, 'test-sample.webp');
    if (fs.existsSync(testSampleFile)) {
        fs.unlinkSync(testSampleFile);
        console.log('🗑️ Removed test-sample.webp fallback file from disk');
    }

    console.log('\n=========================================');
    console.log(`🎉 RESTORATION COMPLETE:`);
    console.log(`✅ Restored / Updated with real images: ${restoredCount}`);
    console.log(`👍 Already had valid images: ${alreadyValidCount}`);
    console.log(`⚠️ Fallback / Remote URLs: ${failedCount}`);
    console.log('=========================================\n');
}

main().catch(console.error).finally(() => prisma.$disconnect());
