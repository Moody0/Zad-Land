"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';

interface ProductsBreadcrumbsProps {
    activeCategory?: {
        name: string;
        slug?: string;
    } | null;
    activeBrand?: {
        name: string;
        slug?: string;
    } | null;
    activeMainCategory?: {
        name: string;
        slug?: string;
    } | null;
}

const ProductsBreadcrumbs = ({ 
    activeCategory = null, 
    activeBrand = null, 
    activeMainCategory = null 
}: ProductsBreadcrumbsProps) => {
    const { language } = useLanguage();
    const isArabic = language === 'ar';

    return (
        <nav className="flex items-center flex-wrap gap-y-2 text-[11px] md:text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6" aria-label="Breadcrumb">
            <Link href="/" className="text-[#072835] dark:text-white/80 hover:text-[#B8860B] transition-colors">
                {isArabic ? 'الرئيسية' : 'Home'}
            </Link>
            
            <span className="mx-2 md:mx-3 text-gray-300 dark:text-white/20">/</span>

            {activeBrand ? (
                <>
                    <Link href="/brands" className="text-[#072835] dark:text-white/80 hover:text-[#B8860B] transition-colors">
                        {isArabic ? 'العلامات التجارية' : 'Brands'}
                    </Link>
                    <span className="mx-2 md:mx-3 text-gray-300 dark:text-white/20">/</span>
                    <span className="text-[#B8860B] dark:text-[#E5B54A] truncate max-w-[200px] md:max-w-none">
                        {activeBrand.name}
                    </span>
                </>
            ) : activeMainCategory ? (
                <>
                    <Link href="/products" className="text-[#072835] dark:text-white/80 hover:text-[#B8860B] transition-colors">
                        {isArabic ? 'الأقسام الرئيسية' : 'Departments'}
                    </Link>
                    <span className="mx-2 md:mx-3 text-gray-300 dark:text-white/20">/</span>
                    <span className="text-[#B8860B] dark:text-[#E5B54A] truncate max-w-[200px] md:max-w-none">
                        {activeMainCategory.name}
                    </span>
                </>
            ) : activeCategory ? (
                <>
                    <Link href="/products" className="text-[#072835] dark:text-white/80 hover:text-[#B8860B] transition-colors">
                        {isArabic ? 'جميع المنتجات' : 'All Products'}
                    </Link>
                    <span className="mx-2 md:mx-3 text-gray-300 dark:text-white/20">/</span>
                    <span className="text-[#B8860B] dark:text-[#E5B54A] truncate max-w-[200px] md:max-w-none">
                        {activeCategory.name}
                    </span>
                </>
            ) : (
                <span className="text-[#072835] dark:text-white font-bold truncate max-w-[150px] md:max-w-none">
                    {isArabic ? 'جميع المنتجات' : 'All Products'}
                </span>
            )}
        </nav>
    );
};

export default ProductsBreadcrumbs;
