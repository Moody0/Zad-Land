'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import ResilientImage from '@/app/components/ResilientImage';
import type { RailBrand } from '@/lib/admin-actions';

interface BrandsRailProps {
    brands?: RailBrand[];
}

// Specialization subtitles matching exact brand category mapping
const BRAND_SUBTITLES: Record<string, { ar: string; en: string }> = {
    'sanino-doro': { ar: 'سانينو دورو', en: 'Sanino D\'Oro' },
    'captain-fisher': { ar: 'مفرزات كابتن فيشر', en: 'Captain Fisher Frozen' },
    'de-cecco-italy': { ar: 'دي سيكو ايطالي', en: 'De Cecco Italian' },
    'rio-mare': { ar: 'ريو ماري ايطالي', en: 'Rio Mare Italian' },
    'americana': { ar: 'امريكانا مفرزات', en: 'Americana Quality' },
    'ottima': { ar: 'اوتيما معكرونة إيطالي', en: 'Ottima Italian Pasta' },
    'mr-brownie': { ar: 'مستر براوني', en: 'Mr. Brownie Cakes' },
    'tat': { ar: 'تات تركي', en: 'Tat Turkish Goods' },
    'american-garden': { ar: 'صوصات أميركان جاردن', en: 'American Garden Sauces' },
    'alicafe': { ar: 'قهوة علي كافيه', en: 'Ali Cafe Coffee' },
    'hygiene': { ar: 'هايجين', en: 'Hygiene Care' },
    'milaf': { ar: 'مشروب ميلاف', en: 'Milaf Beverages' },
    'sante': { ar: 'سانتي', en: 'Sante Healthy' },
    'go-on': { ar: 'غو ان', en: 'Go On Protein' },
    'nabil': { ar: 'نبيل مفرزات', en: 'Nabil Frozen Foods' },
    'master-chef': { ar: 'ماستر شيف', en: 'Master Chef' },
    'pepsi': { ar: 'بيبسي', en: 'Pepsi Beverages' },
    'uludag': { ar: 'اولداغ تركي', en: 'Uludag Drinks' },
    'lovege': { ar: 'حليب لوفيج', en: 'Lovege Plant Milk' },
    'gourmet': { ar: 'غورمت', en: 'Gourmet Foods' },
    'boom-boom': { ar: 'بوم بوم طاقة', en: 'Boom Boom Energy' },
};

export default function BrandsRail({ brands = [] }: BrandsRailProps) {
    const { dir, language } = useLanguage();
    const isArabic = language === 'ar' || dir === 'rtl';

    if (!brands || brands.length === 0) {
        return null;
    }

    const getBrandLabel = (brand: RailBrand) => {
        if (brand.slug && BRAND_SUBTITLES[brand.slug]) {
            return isArabic ? BRAND_SUBTITLES[brand.slug].ar : BRAND_SUBTITLES[brand.slug].en;
        }

        const nameParts = (brand.name || '').split('-');
        if (isArabic && nameParts.length > 1) {
            return nameParts[1].trim();
        }
        return nameParts[0]?.trim() || brand.name;
    };

    return (
        <section className="w-full bg-white dark:bg-[#121212] pt-4 pb-6 md:pt-6 md:pb-8 border-b border-gray-100 dark:border-white/5">
            <div className="container-custom">
                {/* Ornamental Section Header: ─────── 🌾 الشركات العالمية 🌾 ─────── */}
                <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
                    {/* Left Ornamental Line */}
                    <div className="h-[1.5px] flex-1 max-w-[80px] sm:max-w-[140px] md:max-w-[220px] bg-gradient-to-r from-transparent via-[#C5A059]/40 to-[#B8860B] dark:to-[#E5B54A]" />

                    {/* Wheat / Olive Leaf Left */}
                    <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-[#B8860B] dark:text-[#E5B54A] shrink-0"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M12 2C11.5 4 10.5 6 9 7.5C10.5 9 11.5 11 12 13C12.5 11 13.5 9 15 7.5C13.5 6 12.5 4 12 2Z" opacity="0.9" />
                        <path d="M7 6C6.5 8 5.5 10 4 11.5C5.5 13 6.5 15 7 17C7.5 15 8.5 13 10 11.5C8.5 10 7.5 8 7 6Z" />
                        <path d="M17 6C16.5 8 15.5 10 14 11.5C15.5 13 16.5 15 17 17C17.5 15 18.5 13 20 11.5C18.5 10 17.5 8 17 6Z" />
                        <path d="M12 11V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>

                    {/* Section Title */}
                    <h2 className="text-lg sm:text-2xl md:text-[28px] font-extrabold text-[#072835] dark:text-white tracking-tight whitespace-nowrap px-1">
                        {isArabic ? 'الشركات العالمية' : 'Global Partner Brands'}
                    </h2>

                    {/* Wheat / Olive Leaf Right */}
                    <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-[#B8860B] dark:text-[#E5B54A] shrink-0 scale-x-[-1]"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M12 2C11.5 4 10.5 6 9 7.5C10.5 9 11.5 11 12 13C12.5 11 13.5 9 15 7.5C13.5 6 12.5 4 12 2Z" opacity="0.9" />
                        <path d="M7 6C6.5 8 5.5 10 4 11.5C5.5 13 6.5 15 7 17C7.5 15 8.5 13 10 11.5C8.5 10 7.5 8 7 6Z" />
                        <path d="M17 6C16.5 8 15.5 10 14 11.5C15.5 13 16.5 15 17 17C17.5 15 18.5 13 20 11.5C18.5 10 17.5 8 17 6Z" />
                        <path d="M12 11V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>

                    {/* Right Ornamental Line */}
                    <div className="h-[1.5px] flex-1 max-w-[80px] sm:max-w-[140px] md:max-w-[220px] bg-gradient-to-l from-transparent via-[#C5A059]/40 to-[#B8860B] dark:to-[#E5B54A]" />
                </div>

                {/* Symmetrical Brand Cards Grid (8 columns per row on desktop, 4 on tablet, 3-4 on mobile) */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3 md:gap-3.5">
                    {brands.map((brand) => {
                        const brandLabel = getBrandLabel(brand);

                        return (
                            <Link
                                key={brand.id || brand.slug}
                                href={`/brands/${brand.slug}`}
                                className="group flex flex-col items-center justify-between bg-white dark:bg-[#1A1A14] border border-[#B8860B]/20 dark:border-white/10 hover:border-[#B8860B] hover:shadow-md hover:-translate-y-0.5 rounded-xl sm:rounded-2xl p-2 sm:p-2.5 md:p-3 transition-all duration-300"
                            >
                                {/* Brand Logo Container */}
                                <div className="relative w-full h-[36px] sm:h-[46px] md:h-[50px] flex items-center justify-center overflow-hidden">
                                    <ResilientImage
                                        src={brand.image}
                                        alt={brand.name}
                                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>

                                {/* Brand Subtitle / Category Label */}
                                <span className="text-[10px] sm:text-[11px] md:text-[11.5px] font-semibold text-slate-700 dark:text-gray-300 text-center line-clamp-1 group-hover:text-[#B8860B] dark:group-hover:text-[#E5B54A] transition-colors mt-1.5 leading-tight">
                                    {brandLabel}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
