const fs = require('fs');
const path = require('path');

const files = ['logo.png', 'logo.jpeg', 'images/logo.png', 'rounded-favicon.svg', 'favicon.ico'];
for (const f of files) {
    const fullPath = path.join('E:/work/Zad-Land/public', f);
    if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        console.log(`public/${f}: size=${stats.size} bytes`);
    } else {
        console.log(`public/${f}: NOT FOUND`);
    }
}
