const https = require('https');
const crypto = require('crypto');

function fetchDirect(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://postimages.org/'
            },
            ciphers: 'DEFAULT@SECLEVEL=1',
            rejectUnauthorized: false,
            timeout: 10000
        }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return fetchDirect(res.headers.location).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) return reject(new Error('Status ' + res.statusCode));
            const data = [];
            res.on('data', chunk => data.push(chunk));
            res.on('end', () => resolve(Buffer.concat(data)));
            res.on('error', reject);
        });
        req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
        req.on('error', reject);
    });
}

async function run() {
    console.time('fetch');
    const buf = await fetchDirect('https://i.postimg.cc/8CRYPx2m/images-2026-08-17T151112-260.jpg');
    console.timeEnd('fetch');
    console.log('Success, bytes:', buf.length);
}

run().catch(console.error);
