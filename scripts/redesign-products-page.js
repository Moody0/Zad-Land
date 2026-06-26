const fs = require('fs');
const path = require('path');

const headerPath = path.join(__dirname, '..', 'app', 'components', 'ProductsPageComponents', 'ProductsHeader.tsx');
const categoryPath = path.join(__dirname, '..', 'app', 'components', 'ProductsPageComponents', 'CategorySelector.tsx');

const headerContent = `"use client";

import React from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { MdKeyboardArrowDown } from 'react-icons/md';

interface ProductsHeaderProps {
    sort: string;
    setSort: (val: string) => void;
    activeCategory?: {
        name: string;
        description: string | null;
        image: string | null;
    } | null;
    activeBrand?: {
        name: string;
        description: string | null;
        group: string;
    } | null;
}

const ProductsHeader = ({ sort, setSort, activeCategory = null, activeBrand = null }: ProductsHeaderProps) => {
    const { t } = useLanguage();
    const title = activeCategory?.name || activeBrand?.name || t('products.allProducts');
    const description = activeCategory?.description || activeBrand?.description || (activeCategory ? t('products.categoryDescriptionFallback') : t('products.allProductsDescription'));
    const eyebrow = activeCategory ? t('products.categoryCollection') : activeBrand ? t('brands.brandCollection') : t('products.catalogEyebrow');

    return (
        <div className="mb-10 relative overflow-hidden rounded-[32px] bg-[#FDFBF9] dark:bg-[#1a1517] p-8 md:p-14 md:px-16 shadow-[0_4px_40px_-10px_rgba(0,0,0,0.03)] border border-[#f3ebed] dark:border-white/5 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between transition-all duration-500">
            {/* Decorative blurs */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="min-w-0 max-w-3xl relative z-10">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary/80 dark:text-primary/70 mb-4 inline-block bg-primary/5 px-3 py-1.5 rounded-full">
                    {eyebrow}
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.04em] text-[#171214] dark:text-white leading-[1.1]">
                    {title}
                </h1>
                {description && (
                    <p className="mt-4 max-w-2xl text-[15px] md:text-[16px] leading-relaxed text-[#7b676f] dark:text-white/55 font-medium">
                        {description}
                    </p>
                )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 self-start lg:self-end relative z-10">
                <span className="text-sm font-bold tracking-wide text-[#7b676f] dark:text-white/55 uppercase whitespace-nowrap hidden md:block">
                    {t('products.sortBy')}
                </span>
                <div className="relative">
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="w-full sm:w-auto min-w-[200px] cursor-pointer appearance-none rounded-full border border-[#ddd2d6] bg-white px-5 py-3.5 text-sm font-semibold text-[#181113] focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-sm transition-all ltr:pr-12 rtl:pl-12 dark:border-white/10 dark:bg-[#221d20] dark:text-white hover:border-[#c5b8bd] dark:hover:border-white/20"
                    >
                        <option value="best_sellers">{t('products.bestSellers')}</option>
                        <option value="Price: Low to High">{t('products.priceLowHigh')}</option>
                        <option value="Price: High to Low">{t('products.priceHighLow')}</option>
                        <option value="Newest Arrivals">{t('products.newestArrivals')}</option>
                    </select>
                    <MdKeyboardArrowDown className="absolute top-1/2 -translate-y-1/2 pointer-events-none text-[22px] text-primary ltr:right-4 rtl:left-4" />
                </div>
            </div>
        </div>
    );
};

export default ProductsHeader;
`;

const categoryContent = `"use client";

import Link from "next/link";
import React, { useRef, useEffect, useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import ResilientImage from "@/app/components/ResilientImage";

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
}

interface CategorySelectorProps {
    categories: Category[];
    activeCategory?: Category | null;
    activeMainCategory?: { id: string; name: string; slug: string } | null;
}

function getCategoryHref(slug?: string | null) {
    return slug ? \`/categories/\${slug}\` : "/products";
}

const CategorySelector = ({ categories, activeCategory = null }: CategorySelectorProps) => {
    const { t, dir } = useLanguage();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowLeftArrow(Math.abs(scrollLeft) > 5);
        setShowRightArrow(Math.ceil(Math.abs(scrollLeft) + clientWidth) < scrollWidth - 5);
    };

    useEffect(() => {
        handleScroll();
        window.addEventListener('resize', handleScroll);
        return () => window.removeEventListener('resize', handleScroll);
    }, [categories]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            const actualScroll = dir === 'rtl' ? -scrollAmount : scrollAmount;
            scrollContainerRef.current.scrollBy({ left: actualScroll, behavior: 'smooth' });
        }
    };

    return (
        <div className="mb-10 relative">
            <div className="flex items-center justify-between mb-5 px-1">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl md:text-2xl font-bold text-[#1f1418] dark:text-white tracking-tight">
                        {t("products.browseCategories")}
                    </h2>
                    <span className="bg-primary/10 text-primary text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {categories.length} {t("admin.categories")}
                    </span>
                </div>
                
                {/* Desktop Nav Arrows */}
                <div className="hidden md:flex gap-2">
                    <button 
                        onClick={() => scroll(dir === 'rtl' ? 'right' : 'left')}
                        className={\`w-10 h-10 flex items-center justify-center rounded-full border border-[#ece2e5] dark:border-white/10 bg-white dark:bg-[#1a1517] transition-all hover:border-primary hover:text-primary \${!showLeftArrow ? 'opacity-30 cursor-not-allowed' : 'shadow-sm hover:shadow-md hover:scale-105 active:scale-95'}\`}
                        disabled={!showLeftArrow}
                    >
                        <MdChevronLeft className="text-[22px]" />
                    </button>
                    <button 
                        onClick={() => scroll(dir === 'rtl' ? 'left' : 'right')}
                        className={\`w-10 h-10 flex items-center justify-center rounded-full border border-[#ece2e5] dark:border-white/10 bg-white dark:bg-[#1a1517] transition-all hover:border-primary hover:text-primary \${!showRightArrow ? 'opacity-30 cursor-not-allowed' : 'shadow-sm hover:shadow-md hover:scale-105 active:scale-95'}\`}
                        disabled={!showRightArrow}
                    >
                        <MdChevronRight className="text-[22px]" />
                    </button>
                </div>
            </div>

            <div className="relative group">
                <div 
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex overflow-x-auto hide-scrollbar gap-4 md:gap-6 pb-4 px-1 pt-1 scroll-smooth snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {/* All Products Card */}
                    <Link
                        href="/products"
                        className={\`snap-start shrink-0 flex flex-col items-center gap-3 w-[85px] md:w-[100px] transition-all group/item \${!activeCategory ? 'opacity-100 scale-105' : 'opacity-70 hover:opacity-100'}\`}
                    >
                        <div className={\`w-[75px] h-[75px] md:w-[90px] md:h-[90px] rounded-full flex items-center justify-center transition-all duration-300 \${!activeCategory ? 'bg-primary shadow-[0_8px_20px_-6px_rgba(230,118,174,0.6)] border-2 border-primary ring-4 ring-primary/20' : 'bg-[#FDFBF9] dark:bg-[#221d20] border border-[#ece2e5] dark:border-white/10 group-hover/item:border-primary/40 group-hover/item:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] group-hover/item:scale-105'}\`}>
                            <span className={\`text-[26px] md:text-[32px] \${!activeCategory ? 'text-white' : 'text-[#7b676f] dark:text-gray-400 group-hover/item:scale-110 transition-transform'}\`}>✨</span>
                        </div>
                        <span className={\`text-[12px] md:text-[13px] font-bold text-center leading-tight \${!activeCategory ? 'text-primary' : 'text-[#2b1d21] dark:text-gray-300'}\`}>
                            {t("products.allProducts")}
                        </span>
                    </Link>

                    {/* Category Cards */}
                    {categories.map((category) => {
                        const isActive = activeCategory?.slug === category.slug;
                        
                        return (
                            <Link
                                key={category.id}
                                href={getCategoryHref(category.slug)}
                                className={\`snap-start shrink-0 flex flex-col items-center gap-3 w-[85px] md:w-[100px] transition-all group/item \${isActive ? 'opacity-100 scale-105' : 'opacity-70 hover:opacity-100'}\`}
                            >
                                <div className={\`w-[75px] h-[75px] md:w-[90px] md:h-[90px] rounded-full overflow-hidden flex items-center justify-center transition-all duration-300 relative \${isActive ? 'shadow-[0_8px_20px_-6px_rgba(230,118,174,0.6)] border-2 border-primary ring-4 ring-primary/20' : 'bg-[#FDFBF9] dark:bg-[#221d20] border border-[#ece2e5] dark:border-white/10 group-hover/item:border-primary/40 group-hover/item:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] group-hover/item:scale-105'}\`}>
                                    {category.image ? (
                                        <ResilientImage 
                                            src={category.image} 
                                            alt={category.name} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110"
                                        />
                                    ) : (
                                        <span className={\`text-[24px] md:text-[28px] font-bold \${isActive ? 'text-primary' : 'text-[#7b676f] dark:text-gray-400 group-hover/item:scale-110 transition-transform'}\`}>
                                            {category.name.charAt(0)}
                                        </span>
                                    )}
                                    {/* Overlay for inactive state */}
                                    {!isActive && (
                                        <div className="absolute inset-0 bg-white/10 dark:bg-black/20 transition-opacity group-hover/item:opacity-0 pointer-events-none"></div>
                                    )}
                                </div>
                                <span className={\`text-[12px] md:text-[13px] font-bold text-center leading-tight line-clamp-2 \${isActive ? 'text-primary' : 'text-[#2b1d21] dark:text-gray-300'}\`}>
                                    {category.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* Gradient Fades for Scroll Indicators */}
                <div className={\`absolute top-0 bottom-6 left-0 w-12 bg-gradient-to-r from-[#fafafa] dark:from-[#111111] to-transparent pointer-events-none transition-opacity duration-300 \${showLeftArrow && dir !== 'rtl' || showRightArrow && dir === 'rtl' ? 'opacity-100' : 'opacity-0'}\`}></div>
                <div className={\`absolute top-0 bottom-6 right-0 w-12 bg-gradient-to-l from-[#fafafa] dark:from-[#111111] to-transparent pointer-events-none transition-opacity duration-300 \${showRightArrow && dir !== 'rtl' || showLeftArrow && dir === 'rtl' ? 'opacity-100' : 'opacity-0'}\`}></div>
            </div>
        </div>
    );
};

export default CategorySelector;
`;

fs.writeFileSync(headerPath, headerContent, 'utf8');
fs.writeFileSync(categoryPath, categoryContent, 'utf8');
console.log('Successfully redesigned Products Header and Category Selector.');
