'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import { useProductRail } from './useProductRail';
import Image from 'next/image';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import type { RailBrand } from '@/lib/admin-actions';

interface BrandsRailProps {
    brands?: RailBrand[];
}

export default function BrandsRail({ brands = [] }: BrandsRailProps) {
    const { dir, language } = useLanguage();
    const { railRef, canScrollForward, canScrollBackward, scrollForward, scrollBackward } = useProductRail(dir);

    const isRtl = dir === 'rtl';

    // Physically bind Left button (on the left edge) to scroll LEFT:
    const handleLeftScroll = isRtl ? scrollForward : scrollBackward;
    const isLeftDisabled = isRtl ? !canScrollForward : !canScrollBackward;

    // Physically bind Right button (on the right edge) to scroll RIGHT:
    const handleRightScroll = isRtl ? scrollBackward : scrollForward;
    const isRightDisabled = isRtl ? !canScrollBackward : !canScrollForward;

    if (!brands || brands.length === 0) {
        return null;
    }

    return (
        <section className="w-full bg-white dark:bg-[#121212] pt-2 pb-2 md:pt-3 md:pb-3 border-b border-gray-100 dark:border-white/5">
            <div className="container-custom">
                <div className="relative group">
                    <div
                        ref={railRef}
                        className="-mx-4 overflow-x-auto px-4 scrollbar-hide sm:mx-0 sm:px-0"
                    >
                        <div className="flex snap-x snap-mandatory gap-4 sm:gap-6 md:gap-10 pb-2">
                            {brands.map((brand, index) => {
                                const displayName = language === 'ar' ? brand.nameAr : brand.name;
                                return (
                                    <div key={brand.id || brand.slug}>
                                        <Link
                                            href={`/brands/${brand.slug}`}
                                            className="flex flex-col items-center gap-1.5 w-[80px] sm:w-[95px] md:w-[120px] flex-none snap-start group/card"
                                        >
                                            <div className="w-[56px] h-[56px] sm:w-[68px] sm:h-[68px] md:w-[84px] md:h-[84px] rounded-full p-0.5 transition-all duration-300 border border-gray-200 dark:border-white/10 group-hover/card:border-[#B8860B] group-hover/card:ring-2 group-hover/card:ring-[#B8860B]/20 shrink-0">
                                                <div className="w-full h-full rounded-full overflow-hidden relative bg-gray-50 dark:bg-zinc-900">
                                                    <Image
                                                        src={brand.image}
                                                        alt={displayName}
                                                        fill
                                                        quality={65}
                                                        priority={index < 4}
                                                        sizes="(max-width: 768px) 64px, 84px"
                                                        className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                                                    />
                                                </div>
                                            </div>
                                            <h3 className="text-[14px] md:text-[15px] font-semibold text-center text-gray-700 dark:text-gray-300 group-hover/card:text-[#B8860B] dark:group-hover/card:text-[#E5B54A] transition-colors duration-200 flex items-center justify-center gap-1 line-clamp-2 leading-tight">
                                                <span>{displayName}</span>
                                                <svg 
                                                    className={`w-3.5 h-3.5 opacity-0 -translate-x-1.5 group-hover/card:opacity-100 group-hover/card:translate-x-0 text-[#B8860B] transition-all duration-500 ease-out ${dir === 'rtl' ? 'rotate-180' : ''}`} 
                                                    viewBox="0 0 20 20" 
                                                    fill="none" 
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M7.5 3.75L13.75 10L7.5 16.25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                </svg>
                                            </h3>
                                        </Link>
                                    </div>
                                );
                            })}
                            {/* Spacer for mobile */}
                            <div className="w-[1px] shrink-0 sm:hidden"></div>
                        </div>
                    </div>

                    {/* Desktop Navigation Arrows */}
                    <button
                        onClick={handleLeftScroll}
                        disabled={isLeftDisabled}
                        aria-label="Scroll left"
                        className="hidden md:flex !absolute top-1/2 -translate-y-1/2 -left-5 z-20 w-9 h-9 rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 text-zinc-900 dark:text-white hover:bg-[#B8860B] hover:text-white hover:border-[#B8860B] dark:hover:bg-[#B8860B] dark:hover:text-white items-center justify-center transition-all cursor-pointer disabled:opacity-0 disabled:pointer-events-none"
                    >
                        <MdChevronLeft className="text-2xl" />
                    </button>
                    
                    <button
                        onClick={handleRightScroll}
                        disabled={isRightDisabled}
                        aria-label="Scroll right"
                        className="hidden md:flex !absolute top-1/2 -translate-y-1/2 -right-5 z-20 w-9 h-9 rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 text-zinc-900 dark:text-white hover:bg-[#B8860B] hover:text-white hover:border-[#B8860B] dark:hover:bg-[#B8860B] dark:hover:text-white items-center justify-center transition-all cursor-pointer disabled:opacity-0 disabled:pointer-events-none"
                    >
                        <MdChevronRight className="text-2xl" />
                    </button>
                </div>
            </div>
        </section>
    );
}
