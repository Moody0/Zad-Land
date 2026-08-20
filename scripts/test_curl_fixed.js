const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

function downloadFixed(url, destPath) {
    return new Promise((resolve, reject) => {
        execFile('curl.exe', [
            '-s', '-L',
            '--ssl-no-revoke',
            '--tlsv1.2',
            '--max-time', '15',
            '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            url,
            '-o', destPath
        ], (err) => {
            if (err) return reject(err);
            if (!fs.existsSync(destPath) || fs.statSync(destPath).size < 100) {
                if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
                return reject(new Error('Empty download'));
            }
            resolve(destPath);
        });
    });
}

async function test() {
    const urls = [
        'https://i.postimg.cc/8CRYPx2m/images-2026-08-17T151112-260.jpg',
        'https://i.postimg.cc/Hk0K6n0G/41Bx-D1E9QPL.jpg',
        'https://i.postimg.cc/RVLyRqQL/images-2026-08-17T104322-371.jpg'
    ];
    for (const u of urls) {
        const dest = path.join(__dirname, `test_${Date.now()}.jpg`);
        console.time(u);
        await downloadFixed(u, dest);
        console.timeEnd(u);
        console.log('Size:', fs.statSync(dest).size);
        fs.unlinkSync(dest);
    }
}

test().catch(console.error);
