const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function getHash(str) {
    return crypto.createHash('md5').update(str).digest('hex').slice(0, 10);
}

function curlDownload(url, destPath) {
    return new Promise((resolve, reject) => {
        execFile('curl.exe', [
            '-s', '-L',
            '--max-time', '15',
            '-e', 'https://postimages.org/',
            '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            url,
            '-o', destPath
        ], (err) => {
            if (err) return reject(err);
            if (!fs.existsSync(destPath) || fs.statSync(destPath).size < 100) {
                if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
                return reject(new Error('Empty or invalid file downloaded'));
            }
            resolve(destPath);
        });
    });
}

async function mapConcurrent(items, concurrency, fn) {
    const results = [];
    const executing = new Set();
    for (const item of items) {
        const p = Promise.resolve().then(() => fn(item));
        results.push(p);
        executing.add(p);
        const clean = () => executing.delete(p);
        p.then(clean, clean);
        if (executing.size >= concurrency) {
            await Promise.race(executing);
        }
    }
    return Promise.all(results);
}

async function main() {
    console.log('=== Step 1: Collecting all unique remote image URLs ===');
    const products = await prisma.product.findMany({ select: { id: true, images: true } });
    const categories = await prisma.category.findMany({ select: { id: true, image: true } });
    const mainCategories = await prisma.mainCategory.findMany({ select: { id: true, image: true } });

    const remoteUrls = new Set();

    for (const p of products) {
        if (!p.images) continue;
        p.images.split(',').map(s => s.trim()).forEach(u => {
            if (u && !u.startsWith('/uploads/') && !u.startsWith('/placeholder')) remoteUrls.add(u);
        });
    }
    for (const c of categories) {
        if (c.image && !c.image.startsWith('/uploads/') && !c.image.startsWith('/placeholder')) remoteUrls.add(c.image.trim());
    }
    for (const mc of mainCategories) {
        if (mc.image && !mc.image.startsWith('/uploads/') && !mc.image.startsWith('/placeholder')) remoteUrls.add(mc.image.trim());
    }

    const uniqueList = Array.from(remoteUrls);
    console.log(`Found ${uniqueList.length} unique remote images to download and convert.\n`);

    const uploadsDir = path.join(__dirname, '..', 'public', 'uploads', 'products');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const tempDir = path.join(__dirname, 'temp_downloads');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const urlToLocalMap = new Map();
    let completed = 0;
    let failed = 0;

    console.log('=== Step 2: Downloading and converting to WebP ===');

    await mapConcurrent(uniqueList, 4, async (url) => {
        const hash = getHash(url);
        const webpFilename = `img-${hash}.webp`;
        const webpPath = path.join(uploadsDir, webpFilename);
        const localRelativeUrl = `/uploads/products/${webpFilename}`;

        // If already exists on disk, reuse
        if (fs.existsSync(webpPath) && fs.statSync(webpPath).size > 1000) {
            urlToLocalMap.set(url, localRelativeUrl);
            completed++;
            return;
        }

        const tempFile = path.join(tempDir, `temp-${hash}.tmp`);
        try {
            await curlDownload(url, tempFile);
            await sharp(tempFile)
                .resize({ width: 900, withoutEnlargement: true })
                .webp({ quality: 80, effort: 3 })
                .toFile(webpPath);

            urlToLocalMap.set(url, localRelativeUrl);
            completed++;
            if (completed % 15 === 0 || completed === 1) {
                console.log(`[${completed}/${uniqueList.length}] Converted -> ${webpFilename}`);
            }
        } catch (err) {
            failed++;
            console.warn(`[Skip] Could not download: ${url.slice(0, 60)}...`);
        } finally {
            if (fs.existsSync(tempFile)) {
                try { fs.unlinkSync(tempFile); } catch (e) {}
            }
        }
    });

    try { fs.rmdirSync(tempDir); } catch (e) {}

    console.log(`\n=== Step 3: Updating Database Records (${urlToLocalMap.size} mapped URLs) ===`);

    // Update Main Categories
    for (const mc of mainCategories) {
        if (mc.image && urlToLocalMap.has(mc.image.trim())) {
            const newImg = urlToLocalMap.get(mc.image.trim());
            await prisma.mainCategory.update({
                where: { id: mc.id },
                data: { image: newImg }
            });
        }
    }

    // Update Categories
    for (const c of categories) {
        if (c.image && urlToLocalMap.has(c.image.trim())) {
            const newImg = urlToLocalMap.get(c.image.trim());
            await prisma.category.update({
                where: { id: c.id },
                data: { image: newImg }
            });
        }
    }

    // Update Products
    let updatedProducts = 0;
    for (const p of products) {
        if (!p.images) continue;
        const currentList = p.images.split(',').map(s => s.trim()).filter(Boolean);
        let changed = false;
        const newList = currentList.map(u => {
            if (urlToLocalMap.has(u)) {
                changed = true;
                return urlToLocalMap.get(u);
            }
            return u;
        });

        if (changed) {
            await prisma.product.update({
                where: { id: p.id },
                data: { images: newList.join(',') }
            });
            updatedProducts++;
        }
    }

    console.log(`\n🎉 DONE!`);
    console.log(`- Downloaded & converted: ${completed} images`);
    console.log(`- Updated in DB: ${updatedProducts} products, all matching categories.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
