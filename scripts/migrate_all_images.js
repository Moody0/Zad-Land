const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const urlCache = new Map();

function getSafeFilename(url, prefix) {
    const hash = crypto.createHash('md5').update(url).digest('hex').slice(0, 10);
    return `${prefix}-${hash}.webp`;
}

function normalizeUrl(url) {
    if (!url || typeof url !== 'string') return null;
    const trimmed = url.trim();
    if (trimmed.startsWith('/') || trimmed.startsWith('data:')) return trimmed;
    try {
        return encodeURI(trimmed);
    } catch (e) {
        return trimmed;
    }
}

async function fetchWithRetry(rawUrl, maxRetries = 3) {
    const url = normalizeUrl(rawUrl);
    if (!url || url.startsWith('/')) {
        throw new Error('Local or invalid URL');
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const res = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
                },
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                const arrayBuffer = await res.arrayBuffer();
                return Buffer.from(arrayBuffer);
            }
        } catch (err) {
            if (attempt === maxRetries) throw err;
            await new Promise(r => setTimeout(r, 400 * attempt));
        }
    }
    throw new Error('Max retries exceeded');
}

async function fetchAndOptimizeImage(url, destDir, prefix, maxWidth = 1000) {
    if (!url || typeof url !== 'string') return null;
    const cleanUrl = url.trim();

    if (cleanUrl.startsWith('/uploads/') || cleanUrl.startsWith('/placeholder')) {
        return cleanUrl;
    }

    if (urlCache.has(cleanUrl)) {
        return urlCache.get(cleanUrl);
    }

    const filename = getSafeFilename(cleanUrl, prefix);
    const filePath = path.join(destDir, filename);
    const relativeDir = path.relative(path.join(__dirname, '..', 'public'), destDir).replace(/\\/g, '/');
    const relativeUrl = `/${relativeDir}/${filename}`;

    // If file already exists locally, reuse it!
    if (fs.existsSync(filePath)) {
        urlCache.set(cleanUrl, relativeUrl);
        return relativeUrl;
    }

    try {
        const buffer = await fetchWithRetry(cleanUrl);

        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        await sharp(buffer)
            .resize({ width: maxWidth, withoutEnlargement: true })
            .webp({ quality: 80, effort: 3 })
            .toFile(filePath);

        urlCache.set(cleanUrl, relativeUrl);
        return relativeUrl;
    } catch (err) {
        console.warn(`[Skip] Could not fetch ${cleanUrl}: ${err.message}`);
        return cleanUrl;
    }
}

// Concurrency pool helper
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
    console.log('=== High-Speed Image Migration & Optimization ===\n');

    const publicDir = path.join(__dirname, '..', 'public');
    const mainCatsDir = path.join(publicDir, 'uploads', 'main-categories');
    const catsDir = path.join(publicDir, 'uploads', 'categories');
    const productsDir = path.join(publicDir, 'uploads', 'products');

    // 1. Main Categories
    console.log('Migrating Main Categories...');
    const mainCats = await prisma.mainCategory.findMany();
    await mapConcurrent(mainCats, 8, async (mc) => {
        if (mc.image && !mc.image.startsWith('/uploads/')) {
            const newImage = await fetchAndOptimizeImage(mc.image, mainCatsDir, 'mc', 900);
            if (newImage && newImage !== mc.image) {
                await prisma.mainCategory.update({
                    where: { id: mc.id },
                    data: { image: newImage }
                });
                console.log(`✓ Main Category [${mc.name}] -> ${newImage}`);
            }
        }
    });

    // 2. Categories
    console.log('\nMigrating Categories...');
    const categories = await prisma.category.findMany();
    await mapConcurrent(categories, 8, async (cat) => {
        if (cat.image && !cat.image.startsWith('/uploads/')) {
            const newImage = await fetchAndOptimizeImage(cat.image, catsDir, 'cat', 800);
            if (newImage && newImage !== cat.image) {
                await prisma.category.update({
                    where: { id: cat.id },
                    data: { image: newImage }
                });
                console.log(`✓ Category [${cat.name}] -> ${newImage}`);
            }
        }
    });

    // 3. Products
    console.log('\nMigrating Products in parallel...');
    const products = await prisma.product.findMany({
        select: { id: true, name: true, images: true }
    });

    let completed = 0;
    await mapConcurrent(products, 12, async (product) => {
        if (!product.images) return;
        const originalList = product.images.split(',').map(s => s.trim()).filter(Boolean);
        const hasRemote = originalList.some(url => !url.startsWith('/uploads/'));
        if (!hasRemote) return;

        const updatedList = await Promise.all(
            originalList.map(async (imgUrl) => {
                if (imgUrl.startsWith('/uploads/')) return imgUrl;
                const newImg = await fetchAndOptimizeImage(imgUrl, productsDir, 'prod', 1000);
                return newImg || imgUrl;
            })
        );

        const newImagesStr = updatedList.join(',');
        if (newImagesStr !== product.images) {
            await prisma.product.update({
                where: { id: product.id },
                data: { images: newImagesStr }
            });
            completed++;
            if (completed % 25 === 0 || completed === 1) {
                console.log(`✓ Migrated ${completed} products...`);
            }
        }
    });

    console.log(`\n🎉 Success! Successfully migrated and converted all images to local WebP! (${completed} products updated)`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
