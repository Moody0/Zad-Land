const fs = require('fs');
const path = require('path');

const targetDirs = [
    path.join(__dirname, '..', 'app', 'admin', 'components'),
    path.join(__dirname, '..', 'app', 'admin', '(dashboard)'),
    path.join(__dirname, '..', 'app', 'admin', '(auth)')
];

// We will selectively replace layout-specific Tailwind classes with their logical property equivalents.
const replacements = [
    // Padding
    { regex: /(?<=["'\s])pl-([0-9]+|px|auto)(?=["'\s])/g, replace: 'ps-$1' },
    { regex: /(?<=["'\s])pr-([0-9]+|px|auto)(?=["'\s])/g, replace: 'pe-$1' },
    // Margin
    { regex: /(?<=["'\s])ml-([0-9]+|px|auto)(?=["'\s])/g, replace: 'ms-$1' },
    { regex: /(?<=["'\s])mr-([0-9]+|px|auto)(?=["'\s])/g, replace: 'me-$1' },
    // Text Alignment
    { regex: /(?<=["'\s])text-left(?=["'\s])/g, replace: 'text-start' },
    { regex: /(?<=["'\s])text-right(?=["'\s])/g, replace: 'text-end' },
    // Positioning
    { regex: /(?<=["'\s])left-([0-9]+|px|full|auto)(?=["'\s])/g, replace: 'start-$1' },
    { regex: /(?<=["'\s])right-([0-9]+|px|full|auto)(?=["'\s])/g, replace: 'end-$1' },
    { regex: /(?<=["'\s])-left-([0-9]+|px|full|auto)(?=["'\s])/g, replace: '-start-$1' },
    { regex: /(?<=["'\s])-right-([0-9]+|px|full|auto)(?=["'\s])/g, replace: '-end-$1' },
    // Borders
    { regex: /(?<=["'\s])border-l(?=["'\s-])/g, replace: 'border-s' },
    { regex: /(?<=["'\s])border-r(?=["'\s-])/g, replace: 'border-e' },
    // Border Radius
    { regex: /(?<=["'\s])rounded-l-([a-z]+)(?=["'\s])/g, replace: 'rounded-s-$1' },
    { regex: /(?<=["'\s])rounded-r-([a-z]+)(?=["'\s])/g, replace: 'rounded-e-$1' },
    { regex: /(?<=["'\s])rounded-tl-([a-z]+)(?=["'\s])/g, replace: 'rounded-ss-$1' },
    { regex: /(?<=["'\s])rounded-tr-([a-z]+)(?=["'\s])/g, replace: 'rounded-se-$1' },
    { regex: /(?<=["'\s])rounded-bl-([a-z]+)(?=["'\s])/g, replace: 'rounded-es-$1' },
    { regex: /(?<=["'\s])rounded-br-([a-z]+)(?=["'\s])/g, replace: 'rounded-ee-$1' },
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
            
            // Apply all regex rules for logical properties
            replacements.forEach(rule => {
                const newContent = content.replace(rule.regex, rule.replace);
                if (newContent !== content) {
                    content = newContent;
                    modified = true;
                }
            });
            
            // Clean up redundant conditional rendering that is no longer needed after logical properties
            // E.g. ${dir === 'rtl' ? 'start-0 border-s' : 'start-0 border-s'} -> 'start-0 border-s'
            const redundantConditionals = [
                { regex: /\$\{\s*dir\s*===\s*['"]rtl['"]\s*\?\s*['"]([^'"]+)['"]\s*:\s*['"]\1['"]\s*\}/g, replace: '$1' },
                { regex: /\$\{\s*isRtl\s*\?\s*['"]([^'"]+)['"]\s*:\s*['"]\1['"]\s*\}/g, replace: '$1' },
            ];

            redundantConditionals.forEach(rule => {
                const newContent = content.replace(rule.regex, rule.replace);
                if (newContent !== content) {
                    content = newContent;
                    modified = true;
                }
            });

            if (modified) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Converted to logical RTL properties: ${filePath}`);
            }
        }
    });
}

targetDirs.forEach(dir => processDirectory(dir));
console.log('RTL logical property conversion complete.');
