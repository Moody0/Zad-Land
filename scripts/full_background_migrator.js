const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const progressFile = path.join(__dirname, 'migration_progress.json');
let progressMap = {};
if (fs.existsSync(progressFile)) {
    try {
        progressMap = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
    } catch (e) {}
}

function saveProgress() {
    fs.writeFileSync(progressFile, JSON.stringify(progressMap, null, 2), 'utf8');
}

function getHash(str) {
    return crypto.createHash('md5').update(str).digest('hex').slice(0, 10);
}

function extractPostimgPageUrl(directUrl) {
    // e.g. https://i.postimg.cc/8CRYPx2m/images-2026-08-17T151112-260.jpg -> https://postimg.cc/8CRYPx2m
    const match = directUrl.match(/i\.postimg\.cc\/([a-zA-Z0-9]+)\//);
    if (match && match[1]) {
        return `https://postimg.cc/${match[1]}`;
    }
    return 'https://postimages.org/';
}

function downloadOne(url, destPath) {
    const referer = extractPostimgPageUrl(url);
    return new Promise((resolve, reject) => {
        execFile('curl.exe', [
            '-s', '-L',
            '--ssl-no-revoke',
            '--tlsv1.2',
            '--max-time', '45',
            '-e', referer,
            '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            url,
            '-o', destPath
        ], (err) => {
            if (err) return reject(err);
            if (!fs.existsSync(destPath) || fs.statSync(destPath).size < 100) {
                if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
                return reject(new Error('Download incomplete'));
            }
            resolve(destPath);
        });
    });
}

async function updateDbForUrl(oldUrl, newLocalUrl) {
    try {
        // Update main categories
        const mcs = await prisma.mainCategory.findMany({ where: { image: oldUrl } });
        for (const mc of mcs) {
            await prisma.mainCategory.update({ where: { id: mc.id }, data: { image: newLocalUrl } });
        }

        // Update categories
        const cats = await prisma.category.findMany({ where: { image: oldUrl } });
        for (const c of cats) {
            await prisma.category.update({ where: { id: c.id }, data: { image: newLocalUrl } });
        }

        // Update products
        const products = await prisma.product.findMany({
            where: { images: { contains: oldUrl } }
        });
        for (const p of products) {
            if (!p.images) continue;
            const parts = p.images.split(',').map(s => s.trim());
            const updatedParts = parts.map(u => u === oldUrl ? newLocalUrl : u);
            const newStr = updatedParts.join(',');
            if (newStr !== p.images) {
                await prisma.product.update({ where: { id: p.id }, data: { images: newStr } });
            }
        }
    } catch (err) {
        console.error(`DB update error for ${oldUrl}:`, err.message);
    }
}

async function main() {
    console.log('=== Background WebP Image Downloader & Incremental DB Sync ===\n');

    const uploadsDir = path.join(__dirname, '..', 'public', 'uploads', 'products');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    // Collect all remote URLs currently in DB
    const products = await prisma.product.findMany({ select: { images: true } });
    const categories = await prisma.category.findMany({ select: { image: true } });
    const mainCategories = await prisma.mainCategory.findMany({ select: { image: true } });

    const remoteSet = new Set();
    for (const p of products) {
        if (!p.images) continue;
        p.images.split(',').map(s => s.trim()).forEach(u => {
            if (u && !u.startsWith('/uploads/') && !u.startsWith('/placeholder')) remoteSet.add(u);
        });
    }
    for (const c of categories) {
        if (c.image && !c.image.startsWith('/uploads/') && !c.image.startsWith('/placeholder')) remoteSet.add(c.image.trim());
    }
    for (const mc of mainCategories) {
        if (mc.image && !mc.image.startsWith('/uploads/') && !mc.image.startsWith('/placeholder')) remoteSet.add(mc.image.trim());
    }

    const uniqueList = Array.from(remoteSet);
    console.log(`Found ${uniqueList.length} unique remote images remaining in DB.\n`);

    let doneCount = 0;
    let failedCount = 0;

    for (let i = 0; i < uniqueList.length; i++) {
        const url = uniqueList[i];
        const hash = getHash(url);
        const webpFilename = `img-${hash}.webp`;
        const webpPath = path.join(uploadsDir, webpFilename);
        const localRelativeUrl = `/uploads/products/${webpFilename}`;

        // If already converted and exists on disk
        if (fs.existsSync(webpPath) && fs.statSync(webpPath).size > 500) {
            await updateDbForUrl(url, localRelativeUrl);
            progressMap[url] = localRelativeUrl;
            doneCount++;
            continue;
        }

        const tempFile = path.join(uploadsDir, `temp-${hash}.tmp`);
        let success = false;

        // Try downloading up to 2 attempts
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                await downloadOne(url, tempFile);
                await sharp(tempFile)
                    .resize({ width: 900, withoutEnlargement: true })
                    .webp({ quality: 80, effort: 3 })
                    .toFile(webpPath);

                if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);

                await updateDbForUrl(url, localRelativeUrl);
                progressMap[url] = localRelativeUrl;
                saveProgress();
                doneCount++;
                success = true;
                console.log(`[${i + 1}/${uniqueList.length}] ✓ Success -> ${webpFilename}`);
                break;
            } catch (err) {
                if (fs.existsSync(tempFile)) {
                    try { fs.unlinkSync(tempFile); } catch (e) {}
                }
                if (attempt === 2) {
                    failedCount++;
                    console.warn(`[${i + 1}/${uniqueList.length}] ✗ Failed: ${url.slice(0, 60)}`);
                } else {
                    await new Promise(r => setTimeout(r, 1000));
                }
            }
        }
    }

    console.log(`\n🎉 Process finished. ${doneCount} converted and synced, ${failedCount} failed.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
