const fs = require('fs');
const path = require('path');

const categoryPath = path.join(__dirname, '..', 'app', 'components', 'ProductsPageComponents', 'CategorySelector.tsx');
let categoryContent = fs.readFileSync(categoryPath, 'utf8');

// Fix Imports
categoryContent = categoryContent.replace(
    /import { MdChevronLeft, MdChevronRight } from "react-icons\/md";/,
    'import { MdChevronLeft, MdChevronRight, MdGridView } from "react-icons/md";'
);

// Fix Icon
categoryContent = categoryContent.replace(
    /<span className=\{`text-\[26px\] md:text-\[32px\].*?`\}>✨<\/span>/,
    '<MdGridView className={`text-[26px] md:text-[32px] ${!activeCategory ? \'text-white\' : \'text-[#7b676f] dark:text-gray-400 group-hover/item:scale-110 transition-transform\'}`} />'
);

// Fix Scroll Logic
const oldHandleScroll = `    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowLeftArrow(Math.abs(scrollLeft) > 5);
        setShowRightArrow(Math.ceil(Math.abs(scrollLeft) + clientWidth) < scrollWidth - 5);
    };`;

const newHandleScroll = `    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        
        if (dir === 'rtl') {
            const maxScroll = scrollWidth - clientWidth;
            setShowLeftArrow(Math.abs(scrollLeft) < maxScroll - 5); // Can we scroll further left?
            setShowRightArrow(Math.abs(scrollLeft) > 5); // Can we scroll back right?
        } else {
            setShowLeftArrow(scrollLeft > 5);
            setShowRightArrow(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 5);
        }
    };`;

categoryContent = categoryContent.replace(oldHandleScroll, newHandleScroll);

const oldScrollFn = `    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            const actualScroll = dir === 'rtl' ? -scrollAmount : scrollAmount;
            scrollContainerRef.current.scrollBy({ left: actualScroll, behavior: 'smooth' });
        }
    };`;

const newScrollFn = `    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };`;

categoryContent = categoryContent.replace(oldScrollFn, newScrollFn);

// Fix the gradients logic too. In RTL, Left Arrow is on the left, but we show it if we CAN scroll left.
const oldGradients = `{/* Gradient Fades for Scroll Indicators */}
                <div className={\`absolute top-0 bottom-6 left-0 w-12 bg-gradient-to-r from-[#fafafa] dark:from-[#111111] to-transparent pointer-events-none transition-opacity duration-300 \${showLeftArrow && dir !== 'rtl' || showRightArrow && dir === 'rtl' ? 'opacity-100' : 'opacity-0'}\`}></div>
                <div className={\`absolute top-0 bottom-6 right-0 w-12 bg-gradient-to-l from-[#fafafa] dark:from-[#111111] to-transparent pointer-events-none transition-opacity duration-300 \${showRightArrow && dir !== 'rtl' || showLeftArrow && dir === 'rtl' ? 'opacity-100' : 'opacity-0'}\`}></div>`;

const newGradients = `{/* Gradient Fades for Scroll Indicators */}
                <div className={\`absolute top-0 bottom-6 left-0 w-12 bg-gradient-to-r from-[#fafafa] dark:from-[#111111] to-transparent pointer-events-none transition-opacity duration-300 \${showLeftArrow ? 'opacity-100' : 'opacity-0'}\`}></div>
                <div className={\`absolute top-0 bottom-6 right-0 w-12 bg-gradient-to-l from-[#fafafa] dark:from-[#111111] to-transparent pointer-events-none transition-opacity duration-300 \${showRightArrow ? 'opacity-100' : 'opacity-0'}\`}></div>`;

categoryContent = categoryContent.replace(oldGradients, newGradients);

fs.writeFileSync(categoryPath, categoryContent, 'utf8');

const productsClientPath = path.join(__dirname, '..', 'app', '(site)', 'products', 'ProductsClient.tsx');
let productsContent = fs.readFileSync(productsClientPath, 'utf8');

const oldGrid = `<div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">`;
const newGrid = `<div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">`;

productsContent = productsContent.replace(oldGrid, newGrid);

fs.writeFileSync(productsClientPath, productsContent, 'utf8');
console.log('Fixed arrows, icon, and product grid size.');
