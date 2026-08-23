const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const sharp = require('sharp');
const { PrismaClient } = require('@prisma/client');
const xlsx = require('xlsx');

const prisma = new PrismaClient();
const excelPath = 'C:\\Users\\moham\\Downloads\\Zad Land\\Zad Land Products.xlsx';

function downloadBuffer(url, retries = 3) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Referer': 'https://postimages.org/'
            }
        };

        client.get(url, options, (res) => {
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
        }).on('error', (err) => {
            if (retries > 0) {
                setTimeout(() => downloadBuffer(url, retries - 1).then(resolve).catch(reject), 1000);
            } else {
                reject(err);
            }
        });
    });
}

async function testSingle() {
    const url = 'https://i.postimg.cc/Bnf1dXCp/66b0b8cc3559ea83311d126d.webp';
    console.log('Testing download for:', url);
    const buf = await downloadBuffer(url);
    console.log('Downloaded bytes:', buf.length);
    const webpBuf = await sharp(buf).webp({ quality: 85 }).toBuffer();
    const dest = path.join(__dirname, '../public/uploads/products', 'hygiene-intimate-velvet.webp');
    fs.writeFileSync(dest, webpBuf);
    console.log('Saved successfully to:', dest, 'size:', webpBuf.length);
}

testSingle().catch(console.error).finally(() => prisma.$disconnect());
