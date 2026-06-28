"use client";

import React from 'react';
import { useLanguage } from '@/app/context/LanguageContext';

interface ProductsHeaderProps {

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

const ProductsHeader = ({ activeCategory = null, activeBrand = null }: ProductsHeaderProps) => {
    const { t, dir } = useLanguage();
    const title = activeCategory?.name || activeBrand?.name || t('products.allProducts');
    const description = activeCategory?.description || activeBrand?.description || (activeCategory ? t('products.categoryDescriptionFallback') : t('products.allProductsDescription'));
    const eyebrow = activeCategory ? t('products.categoryCollection') : activeBrand ? t('brands.brandCollection') : t('products.catalogEyebrow');

    const bgImage = activeCategory?.image || activeBrand?.image;

    return (
        <div className="mb-6 relative overflow-hidden rounded-2xl bg-[#FDFBF9] dark:bg-[#1a1517] min-h-[160px] md:min-h-[200px] flex flex-col justify-center p-6 md:p-10 shadow-sm border border-[#f3ebed] dark:border-white/5 transition-all duration-500">
            {bgImage ? (
                <>
                    <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${bgImage})` }}
                    />
                    <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
                </>
            ) : (
                <>
                    {/* Decorative blurs */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                </>
            )}

            <div className="min-w-0 max-w-3xl relative z-10">
                <p className={`text-[11px] font-bold uppercase tracking-[0.25em] mb-3 inline-block px-3 py-1.5 rounded-full ${bgImage ? 'bg-white/20 text-white backdrop-blur-md' : 'bg-primary/5 text-primary/80 dark:text-primary/70'}`}>
                    {eyebrow}
                </p>
                <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold tracking-[-0.02em] leading-[1.1] ${bgImage ? 'text-white' : 'text-[#171214] dark:text-white'}`}>
                    {title}
                </h1>
                {description && (
                    <p className={`mt-3 max-w-2xl text-[14px] md:text-[15px] leading-relaxed font-medium line-clamp-2 ${bgImage ? 'text-white/80' : 'text-[#7b676f] dark:text-white/55'}`}>
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProductsHeader;
