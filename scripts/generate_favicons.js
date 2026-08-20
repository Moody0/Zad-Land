const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicons() {
    const inputPath = 'E:/work/Zad-Land/public/logo.png';
    const metadata = await sharp(inputPath).metadata();
    console.log(`Original logo: ${metadata.width}x${metadata.height}, format: ${metadata.format}`);

    // 1. Generate 32x32 PNG for favicon
    const fav32Buffer = await sharp(inputPath)
        .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png()
        .toBuffer();
    
    fs.writeFileSync('E:/work/Zad-Land/public/favicon-32x32.png', fav32Buffer);
    fs.writeFileSync('E:/work/Zad-Land/public/favicon.ico', fav32Buffer);
    fs.writeFileSync('E:/work/Zad-Land/app/favicon.ico', fav32Buffer);

    // 2. Generate 16x16 PNG
    await sharp(inputPath)
        .resize(16, 16, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png()
        .toFile('E:/work/Zad-Land/public/favicon-16x16.png');

    // 3. Generate 180x180 Apple Touch Icon
    const appleIconBuffer = await sharp(inputPath)
        .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png()
        .toBuffer();
    
    fs.writeFileSync('E:/work/Zad-Land/public/apple-touch-icon.png', appleIconBuffer);
    fs.writeFileSync('E:/work/Zad-Land/app/apple-icon.png', appleIconBuffer);

    // 4. Generate 192x192 & 512x512 PWA icons & app/icon.png
    const icon192Buffer = await sharp(inputPath)
        .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png()
        .toBuffer();
    
    fs.writeFileSync('E:/work/Zad-Land/public/android-chrome-192x192.png', icon192Buffer);
    fs.writeFileSync('E:/work/Zad-Land/app/icon.png', icon192Buffer);

    await sharp(inputPath)
        .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png()
        .toFile('E:/work/Zad-Land/public/android-chrome-512x512.png');

    // Remove the 0-byte corrupt file
    if (fs.existsSync('E:/work/Zad-Land/public/rounded-favicon.svg')) {
        fs.unlinkSync('E:/work/Zad-Land/public/rounded-favicon.svg');
    }

    console.log("✅ All favicon and browser tab icons successfully generated!");
}

generateFavicons().catch(console.error);
