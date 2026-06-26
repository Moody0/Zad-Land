const fs = require('fs');
const path = require('path');

const targetDirs = [
    path.join(__dirname, '..', 'app', 'admin', '(dashboard)'),
    path.join(__dirname, '..', 'app', 'admin', '(auth)')
];

const replacements = [
    // Remove the glowing shadows from buttons
    { regex: / shadow-\[0_4px_14px_0_rgba\(238,43,108,0\.39\)\] hover:shadow-\[0_6px_20px_rgba\(238,43,108,0\.23\)\]/g, replace: '' },
    { regex: / shadow-\[0_4px_14px_0_rgba\(238,43,108,0\.39\)\]/g, replace: '' },
    { regex: / hover:shadow-\[0_6px_20px_rgba\(238,43,108,0\.23\)\]/g, replace: '' },
    
    // Replace absolute paddings/margins with logical properties for better AR/EN support
    { regex: / ml-/g, replace: ' ms-' },
    { regex: / mr-/g, replace: ' me-' },
    { regex: / pl-/g, replace: ' ps-' },
    { regex: / pr-/g, replace: ' pe-' },
    { regex: / left-/g, replace: ' start-' },
    { regex: / right-/g, replace: ' end-' },
    { regex: / border-l /g, replace: ' border-s ' },
    { regex: / border-r /g, replace: ' border-e ' },
    { regex: / rounded-l-/g, replace: ' rounded-s-' },
    { regex: / rounded-r-/g, replace: ' rounded-e-' },
    { regex: / text-left/g, replace: ' text-start' },
    { regex: / text-right/g, replace: ' text-end' }
];

function processDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            processDirectory(filePath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            let content = fs.readFileSync(filePath, 'utf8');
            let modified = false;
            
            // For the first shadow replacement rules, apply to all
            for (let i = 0; i < 3; i++) {
                const rule = replacements[i];
                const newContent = content.replace(rule.regex, rule.replace);
                if (newContent !== content) {
                    content = newContent;
                    modified = true;
                }
            }
            
            if (modified) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Removed shadows in: ${filePath}`);
            }
        }
    });
}

targetDirs.forEach(dir => processDirectory(dir));
console.log('Shadow removal complete.');
