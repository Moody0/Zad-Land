"use client";

import React from 'react';
import ResilientImage from '@/app/components/ResilientImage';
import { useLanguage } from '@/app/context/LanguageContext';
import { MdVerified, MdInventory2 } from 'react-icons/md';

interface BrandHeroHeaderProps {
    brand: {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        image: string | null;
    };
    totalProducts: number;
}

export default function BrandHeroHeader({ brand, totalProducts }: BrandHeroHeaderProps) {
    const { language, dir } = useLanguage();
    const isArabic = language === 'ar';

    const fallbackImage = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800";
    const brandImage = brand.image || fallbackImage;

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FAF6EC] via-white to-[#FAF6EC]/60 dark:from-[#1A1A14] dark:via-[#141410] dark:to-[#072835]/40 border border-[#B8860B]/25 p-4 sm:p-6 md:p-8 mb-6 shadow-xs">
            {/* Ambient Background Gold Glow */}
            <div className="absolute top-0 end-0 w-64 h-64 bg-[#B8860B]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

            <div className={`flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 relative z-10 ${dir === 'rtl' ? 'sm:text-right' : 'sm:text-left'} text-center`}>
                {/* Brand Logo */}
                <div className="shrink-0 w-[84px] h-[84px] sm:w-[100px] sm:h-[100px] rounded-2xl p-1 bg-white dark:bg-zinc-900 border-2 border-[#B8860B]/40 shadow-sm flex items-center justify-center">
                    <div className="relative w-full h-full rounded-xl overflow-hidden bg-white dark:bg-zinc-800 p-1.5 flex items-center justify-center">
                        <ResilientImage
                            src={brandImage}
                            alt={brand.name}
                            showSkeleton={false}
                            className="w-full h-full object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Brand Details */}
                <div className="flex-1 min-w-0">
                    {/* Badge & Stock */}
                    <div className="flex items-center justify-center sm:justify-start flex-wrap gap-2 mb-1.5">
                        <span className="inline-flex items-center gap-1 bg-[#2E7D32]/10 dark:bg-[#2E7D32]/20 text-[#2E7D32] dark:text-[#4ade80] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#2E7D32]/30">
                            <MdVerified className="text-sm" />
                            <span>{isArabic ? 'شريك وموزع معتمد' : 'Verified Brand Partner'}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 bg-[#B8860B]/10 dark:bg-[#B8860B]/20 text-[#B8860B] dark:text-[#E5B54A] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#B8860B]/30">
                            <MdInventory2 className="text-xs" />
                            <span>{totalProducts} {isArabic ? 'منتج جملة متاح' : 'Wholesale Products'}</span>
                        </span>
                    </div>

                    {/* Brand Title */}
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#072835] dark:text-white tracking-tight leading-tight mb-2">
                        {brand.name}
                    </h1>

                    {/* Description */}
                    {brand.description && (
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                            {brand.description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
