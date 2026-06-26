const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'app', 'admin', '(dashboard)');

const replacements = [
    { 
        regex: /bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-black\/\[0\.04\] dark:border-white\/\[0\.04\] dark:border-white\/\[0\.04\] shadow-sm/g, 
        replace: 'bg-white dark:bg-surface-dark p-5 rounded-2xl border border-black/[0.04] dark:border-white/[0.04] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)]' 
    },
    {
        // Fix labels inside these cards to use the new typography
        regex: /text-text-sub dark:text-gray-400 text-xs font-bold uppercase tracking-wider/g,
        replace: 'text-text-sub dark:text-gray-400 text-[11px] font-bold uppercase tracking-widest'
    }
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
            
            replacements.forEach(rule => {
                const newContent = content.replace(rule.regex, rule.replace);
                if (newContent !== content) {
                    content = newContent;
                    modified = true;
                }
            });
            
            if (modified) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Upgraded stats cards in: ${filePath}`);
            }
        }
    });
}

processDirectory(targetDir);
console.log('Stats cards upgrade complete.');
