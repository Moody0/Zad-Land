const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'app', 'admin', '(dashboard)');

const replacements = [
    // Page containers
    { regex: /bg-background-light p-8 dark:bg-background-dark/g, replace: 'bg-[#fafafa] dark:bg-[#111111] p-6 md:p-10' },
    { regex: /bg-background-light p-4 md:p-8 dark:bg-background-dark/g, replace: 'bg-[#fafafa] dark:bg-[#111111] p-6 md:p-10' },
    { regex: /max-w-\[1200px\]/g, replace: 'max-w-[1400px]' },
    { regex: /text-2xl font-bold/g, replace: 'text-2xl md:text-3xl font-bold tracking-tight' },
    
    // Cards & Lists
    { regex: /rounded-xl border border-\[#e6dbdf\] bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-surface-dark/g, replace: 'rounded-2xl border border-black/[0.04] dark:border-white/[0.04] bg-white dark:bg-surface-dark shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)]' },
    { regex: /border-\[#e6dbdf\]/g, replace: 'border-black/[0.04] dark:border-white/[0.04]' },
    { regex: /dark:border-gray-700/g, replace: 'dark:border-white/[0.04]' },
    
    // Table parts
    { regex: /bg-background-light\/50 dark:bg-gray-800\/50/g, replace: 'bg-gray-50/50 dark:bg-gray-800/20' },
    { regex: /divide-\[#e6dbdf\]/g, replace: 'divide-black/[0.04] dark:divide-white/[0.04]' },
    { regex: /hover:bg-background-light dark:hover:bg-gray-800/g, replace: 'hover:bg-gray-50/50 dark:hover:bg-white/[0.02]' },
    
    // Modals
    { regex: /rounded-2xl bg-white shadow-xl dark:bg-surface-dark/g, replace: 'rounded-[24px] bg-white dark:bg-surface-dark shadow-[0_24px_50px_-12px_rgba(0,0,0,0.1)] border border-black/[0.04] dark:border-white/[0.04]' },
    
    // Header/Search Inputs
    { regex: /bg-white pl-10 pr-4/g, replace: 'bg-white dark:bg-surface-dark pl-10 pr-4' },
    
    // Table Headers
    { regex: /text-xs font-bold uppercase tracking-wider text-text-sub dark:text-gray-400/g, replace: 'text-[11px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400' },
    
    // Buttons (like Add Brand)
    { regex: /hover:bg-primary\/90/g, replace: 'hover:bg-primary/90 shadow-[0_4px_14px_0_rgba(238,43,108,0.39)] hover:shadow-[0_6px_20px_rgba(238,43,108,0.23)]' }
];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            processDirectory(filePath);
        } else if (file.endsWith('.tsx')) {
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
                console.log(`Updated: ${filePath}`);
            }
        }
    });
}

processDirectory(targetDir);
console.log('Refactor complete.');
