const sharp = require('sharp');
const fs = require('fs');

async function createCircularIcon(size) {
    const inputPath = 'E:/work/Zad-Land/public/logo.png';
    const logoSize = Math.round(size * 0.82); // 82% of container with balanced breathing room
    
    // 1. Create a crisp white circular background
    const circleSvg = Buffer.from(`
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
            <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#ffffff"/>
        </svg>
    `);

    const backgroundCircle = await sharp(circleSvg).png().toBuffer();

    // 2. Resize the logo with transparency
    const resizedLogo = await sharp(inputPath)
        .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();

    // 3. Composite resized logo in the center of the white circle
    const finalIcon = await sharp(backgroundCircle)
        .composite([{
            input: resizedLogo,
            gravity: 'center'
        }])
        .png()
        .toBuffer();

    return finalIcon;
}

async function generateAllCircularIcons() {
    console.log("Generating white circular background icons...");

    // 512x512
    const icon512 = await createCircularIcon(512);
    fs.writeFileSync('E:/work/Zad-Land/public/android-chrome-512x512.png', icon512);

    // 192x192
    const icon192 = await createCircularIcon(192);
    fs.writeFileSync('E:/work/Zad-Land/public/android-chrome-192x192.png', icon192);
    fs.writeFileSync('E:/work/Zad-Land/app/icon.png', icon192);

    // 180x180 (Apple Touch Icon)
    const icon180 = await createCircularIcon(180);
    fs.writeFileSync('E:/work/Zad-Land/public/apple-touch-icon.png', icon180);
    fs.writeFileSync('E:/work/Zad-Land/app/apple-icon.png', icon180);

    // 32x32
    const icon32 = await createCircularIcon(32);
    fs.writeFileSync('E:/work/Zad-Land/public/favicon-32x32.png', icon32);
    fs.writeFileSync('E:/work/Zad-Land/public/favicon.ico', icon32);
    fs.writeFileSync('E:/work/Zad-Land/app/favicon.ico', icon32);

    // 16x16
    const icon16 = await createCircularIcon(16);
    fs.writeFileSync('E:/work/Zad-Land/public/favicon-16x16.png', icon16);

    console.log("✅ All icons generated with clean white circular background!");
}

generateAllCircularIcons().catch(console.error);
