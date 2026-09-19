'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import ResilientImage from '@/app/components/ResilientImage';
import { MdChevronRight } from 'react-icons/md';
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

    // On wide desktop: Display 16 premier brands in 2 balanced rows of 8
    const desktopBrands = brands.slice(0, 16);

    const renderBrandCard = (brand: RailBrand, isCompact = false) => {
        const brandLabel = getBrandLabel(brand);

        return (
            <Link
                key={brand.id || brand.slug}
                href={`/brands/${brand.slug}`}
                className={`group flex flex-col items-center justify-between bg-white dark:bg-[#1A1A14] border border-[#B8860B]/20 dark:border-white/10 hover:border-[#B8860B] hover:shadow-md hover:-translate-y-0.5 rounded-xl sm:rounded-2xl transition-all duration-300 ${
                    isCompact ? 'p-2 min-h-[92px] w-full snap-start' : 'p-2.5 sm:p-3 min-h-[105px] sm:min-h-[115px]'
                }`}
            >
                {/* Brand Logo Container with High Visual Impact */}
                <div className={`relative w-full flex items-center justify-center overflow-hidden ${
                    isCompact ? 'h-[38px]' : 'h-[44px] sm:h-[50px] md:h-[54px]'
                }`}>
                    <ResilientImage
                        src={brand.image}
                        alt=""
                        showSkeleton={false}
                        sizes="(max-width: 768px) 140px, 160px"
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-108"
                    />
                </div>

                {/* Brand Subtitle / Category Label */}
                <span className="text-[10px] sm:text-[11px] md:text-[12px] font-bold text-slate-800 dark:text-gray-200 text-center line-clamp-1 group-hover:text-[#B8860B] dark:group-hover:text-[#E5B54A] transition-colors mt-1 leading-snug">
                    {brandLabel}
                </span>
            </Link>
        );
    };

    // Order brands for mobile to match target screenshot: Mersin, American Garden, HiGeen, Captain Fisher, Sante
    const targetMobileOrder = ['mersin', 'american-garden', 'hygiene', 'captain-fisher', 'sante'];
    const mobileBrands = [...brands].sort((a, b) => {
        const idxA = targetMobileOrder.indexOf(a.slug || '');
        const idxB = targetMobileOrder.indexOf(b.slug || '');
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return 0;
    });

    return (
        <section className="w-full bg-white dark:bg-[#1A1A14] rounded-t-[32px] sm:rounded-t-[38px] pt-4 pb-3 md:pt-6 md:pb-8 border-b border-gray-100 dark:border-white/5 shadow-[0_-6px_25px_rgba(0,0,0,0.08)] -mt-8 sm:-mt-10 md:-mt-12 relative z-20">
            <div className="container-custom">
                {/* 1. Mobile Header (< md): "‹ عرض الكل" on left, "── ❖ شركاؤنا العالميون ❖ ──" in center */}
                <div className="flex md:hidden relative items-center justify-center h-7 px-2 mb-2.5">
                    {/* View All Link - Fixed on left side of screen matching reference */}
                    <Link
                        href="/brands"
                        className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-gray-500 hover:text-[#B8860B] dark:text-gray-400 flex items-center gap-0.5 transition-colors z-10"
                    >
                        <span className="text-xs leading-none">‹</span>
                        <span>{isArabic ? 'عرض الكل' : 'View All'}</span>
                    </Link>

                    {/* Center Ornamental Title */}
                    <div className="flex items-center gap-1.5 pointer-events-none">
                        <div className="h-[1px] w-4 sm:w-6 bg-[#C5A059]/40" />
                        <span className="text-[#B8860B] text-xs">❖</span>
                        <h2 className="text-xs sm:text-sm font-extrabold text-[#072835] dark:text-white whitespace-nowrap px-0.5">
                            {isArabic ? 'شركاؤنا العالميون' : 'Our Global Partners'}
                        </h2>
                        <span className="text-[#B8860B] text-xs">❖</span>
                        <div className="h-[1px] w-4 sm:w-6 bg-[#C5A059]/40" />
                    </div>
                </div>

                {/* 2. Desktop Section Header (>= md): ─────── 🌾 الشركات العالمية 🌾 ─────── */}
                <div className="hidden md:flex items-center justify-center gap-3 sm:gap-4 md:gap-6 mb-5 sm:mb-6 md:mb-7">
                    {/* Left Ornamental Line */}
                    <div className="h-[1.5px] flex-1 max-w-[60px] sm:max-w-[120px] md:max-w-[200px] bg-gradient-to-r from-transparent via-[#C5A059]/40 to-[#B8860B] dark:to-[#E5B54A]" />

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
                    <h2 className="text-base sm:text-2xl md:text-[28px] font-extrabold text-[#072835] dark:text-white tracking-tight whitespace-nowrap px-1">
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
                    <div className="h-[1.5px] flex-1 max-w-[60px] sm:max-w-[120px] md:max-w-[200px] bg-gradient-to-l from-transparent via-[#C5A059]/40 to-[#B8860B] dark:to-[#E5B54A]" />
                </div>

                {/* 1. Mobile Experience (< md): Single Row Horizontal Scroll matching Target Design */}
                <div className="md:hidden">
                    <div className="-mx-4 px-4 overflow-x-auto scrollbar-hide py-1">
                        <div className="flex items-center gap-2.5 snap-x">
                            {mobileBrands.map((brand) => {
                                const isMersin = brand.slug === 'mersin';
                                return (
                                    <Link
                                        key={brand.id || brand.slug}
                                        href={`/brands/${brand.slug}`}
                                        className="group shrink-0 w-[84px] sm:w-[92px] h-[78px] sm:h-[84px] bg-white dark:bg-zinc-800/90 rounded-2xl border border-gray-200/70 dark:border-white/10 hover:border-[#B8860B] p-2 flex flex-col items-center justify-center snap-start transition-all shadow-2xs hover:shadow-xs"
                                    >
                                        <div className={`w-full flex items-center justify-center relative overflow-hidden ${isMersin ? 'h-[44px]' : 'h-[52px]'}`}>
                                            <ResilientImage
                                                src={brand.image}
                                                alt={brand.name}
                                                showSkeleton={false}
                                                sizes="90px"
                                                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        {isMersin && (
                                            <span className="text-[10px] font-bold text-slate-800 dark:text-gray-200 text-center truncate w-full mt-0.5">
                                                Mersin
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 2. Desktop & Tablet Experience (>= md): Symmetrical 8-Column Grid (2 Balanced Rows of 8) */}
                <div className="hidden md:block">
                    <div className="grid grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-3.5">
                        {desktopBrands.map((brand) => renderBrandCard(brand, false))}
                    </div>

                    {/* Subtle "Explore All Brands" Action Pill */}
                    {brands.length > 16 && (
                        <div className="mt-5 flex justify-center">
                            <Link
                                href="/brands"
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-[#072835] dark:text-[#E5B54A] hover:text-[#B8860B] bg-[#FAF6EC] dark:bg-white/5 border border-[#B8860B]/20 hover:border-[#B8860B]/50 transition-all duration-200 shadow-2xs hover:shadow-xs group"
                            >
                                <span>{isArabic ? `تصفح كافة الشركات والعلامات (${brands.length}+)` : `View All Partner Brands (${brands.length}+)`}</span>
                                <MdChevronRight className={`text-base transition-transform group-hover:translate-x-0.5 ${isArabic ? 'rotate-180 group-hover:-translate-x-0.5' : ''}`} />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
