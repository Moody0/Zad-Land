"use client";

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
