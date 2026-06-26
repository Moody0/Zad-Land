const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'app', 'admin', '(dashboard)');

const replacements = [
    // Clean up duplicate borders
    { regex: /dark:border-white\/\[0\.04\] dark:border-white\/\[0\.04\]/g, replace: 'dark:border-white/[0.04]' },
    
    // Upgrade inputs to the premium login-style inputs
    { regex: /bg-background-light dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:ring-1 focus:ring-primary focus:border-primary/g, replace: 'bg-gray-50/50 dark:bg-black/20 focus:bg-white dark:focus:bg-surface-dark focus:ring-4 focus:ring-primary/10 focus:border-primary' },
    
    // Upgrade Modal Footers (from bg-background-light or similar)
    { regex: /bg-background-light dark:bg-gray-800\/50 border-t/g, replace: 'bg-gray-50/50 dark:bg-black/20 border-t' },
    { regex: /bg-gray-50 dark:bg-gray-800\/50 border-t/g, replace: 'bg-gray-50/50 dark:bg-black/20 border-t' },
    
    // Upgrade Modal Save/Submit Buttons
    { regex: /transition-all transform hover:-translate-y-0\.5 active:translate-y-0/g, replace: 'transition-all transform active:scale-[0.98]' },
    { regex: /hover:-translate-y-0\.5 active:translate-y-0/g, replace: 'active:scale-[0.98]' },
    
    // Upgrade Cancel Buttons
    { regex: /hover:bg-white dark:hover:bg-gray-800/g, replace: 'hover:bg-black/5 dark:hover:bg-white/5' },
    
    // Clean up labels
    { regex: /text-sm font-bold text-text-main dark:text-white/g, replace: 'text-[11px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400' },
    
    // Fix inner background containers (like image preview area)
    { regex: /bg-gray-50 dark:bg-gray-800/g, replace: 'bg-gray-50/50 dark:bg-black/20' }
];

function processDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            processDirectory(filePath);
        } else if (file.endsWith('Modal.tsx')) {
            let content = fs.readFileSync(filePath, 'utf8');
            let modified = false;
            
            replacements.forEach(rule => {
                const newContent = content.replace(rule.regex, rule.replace);
                if (newContent !== content) {
                    content = newContent;
                    modified = true;
                }
            });
            
            if (modified) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Refactored modal interior: ${filePath}`);
            }
        }
    });
}

processDirectory(targetDir);
console.log('Modal interior refactor complete.');
