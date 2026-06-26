"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';

interface BreadcrumbsProps {
    productName: string;
    categoryName?: string;
    categorySlug?: string;
}

const Breadcrumbs = ({ productName, categoryName, categorySlug }: BreadcrumbsProps) => {
    const { language } = useLanguage();

    return (
        <nav className="flex items-center flex-wrap gap-y-2 text-[11px] md:text-[12px] font-bold text-[#000000]/40 uppercase tracking-[0.1em] mb-6" aria-label="Breadcrumb">
            <Link href="/" className="text-[#000000] dark:text-white/60 hover-underline-animated">
                {language === 'ar' ? 'الرئيسية' : 'Home'}
            </Link>
            
            <span className="mx-2 md:mx-4 text-gray-300">|</span>
            
            <Link href="/products" className="text-[#000000] dark:text-white/60 hover-underline-animated">
                {language === 'ar' ? 'جميع المنتجات' : 'All Products'}
            </Link>

            {categoryName && categorySlug && (
                <>
                    <span className="mx-2 md:mx-4 text-gray-300">|</span>
                    <Link href={`/categories/${categorySlug}`} className="text-[#000000] dark:text-white/60 hover-underline-animated">
                        {categoryName}
                    </Link>
                </>
            )}

            <span className="mx-2 md:mx-4 text-gray-300">|</span>
            
            <span className="text-[#000000] dark:text-white truncate max-w-[150px] md:max-w-none">
                {productName}
            </span>
        </nav>
    );
};

export default Breadcrumbs;
