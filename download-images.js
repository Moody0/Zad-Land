const fs = require('fs');
const path = require('path');
const stream = require('stream');
const { promisify } = require('util');
const pipeline = promisify(stream.pipeline);

const urls = [
    'https://i.postimg.cc/VkWt3Vdx/images-(7)-Nero-AI-Image-Upscaler-Photo-Face.jpg',
    'https://i.postimg.cc/Hnn85Y2P/photo-2026-02-09-19-57-13.jpg',
    'https://i.postimg.cc/mkBT98yJ/Designer-(5).png',
    'https://i.postimg.cc/J4pjGJ4c/photo-2026-02-09-19-59-57.jpg',
    'https://i.postimg.cc/rpZ4QRPt/Designer-(4).png',
    'https://i.postimg.cc/ZnRDXNbR/Designer-(6).png',
    'https://i.postimg.cc/L5xBKQCM/images-(6)-Nero-AI-Image-Upscaler-Photo-Face.jpg',
    'https://i.postimg.cc/VLNdHkXV/images-(5)-Nero-AI-Image-Upscaler-Photo-Face.jpg',
    'https://i.postimg.cc/TYkQZ1FD/Designer-(7).png',
    'https://i.postimg.cc/fTzgGxr3/Ruby-Face-Professional-Beauty-Tools-Manicure-set-5pcs-Mauve.jpg',
    'https://i.postimg.cc/v80m9wCr/CAT-EYE-RUBY-315x315-Nero-AI-Image-Upscaler-Photo-Face.jpg',
    'https://i.postimg.cc/C5QLVFSn/Designer-(3).png'
];

async function downloadImages() {
    await Promise.all(urls.map(async (url) => {
        const filename = path.basename(url);
        const filepath = path.join(__dirname, 'public', 'images', 'categories', filename);
        
        try {
            console.log(`Downloading ${filename}...`);
            const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
            if (!response.ok) throw new Error(`Status ${response.status}`);
            
            const fileStream = fs.createWriteStream(filepath);
            await pipeline(response.body, fileStream);
            console.log(`Successfully downloaded ${filename}`);
        } catch (err) {
            console.error(`Failed to download ${filename}:`, err.message);
        }
    }));
}

downloadImages();
