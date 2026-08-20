'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';

interface PromoBannerProps {
    settings?: {
        middleBanner1Image?: string | null;
        middleBanner1Link?: string | null;
    };
}

const PromoBanner = ({ settings }: PromoBannerProps) => {
    const { dir } = useLanguage();
    const isArabic = dir === 'rtl';

    const bannerLink = settings?.middleBanner1Link || '/products';

    return (
        <section className="container-custom">
            <div className="relative w-full rounded-2xl overflow-hidden py-5 md:py-0 md:h-[140px] flex items-center px-5 sm:px-8 md:px-12 bg-[#FAF6EC] dark:bg-[#1A1A14] border border-[#B8860B]/30 shadow-xs">
                {/* Content Container */}
                <div className={`w-full flex flex-col md:flex-row items-center justify-between gap-4 z-10 ${isArabic ? '' : 'md:flex-row-reverse'}`}>
                    {/* CTA Button */}
                    <div className="w-full md:w-auto flex justify-center md:justify-end shrink-0">
                        <Link
                            href={bannerLink}
                            className="w-full md:w-auto text-center px-6 sm:px-8 py-2.5 sm:py-3 bg-[#2E7D32] hover:bg-[#256629] text-white rounded-full font-bold text-xs sm:text-sm md:text-base transition-all active:scale-95 whitespace-nowrap shadow-xs"
                        >
                            {isArabic ? 'استعراض عروض التوريد' : 'Explore Supply Deals'}
                        </Link>
                    </div>

                    {/* Text Content */}
                    <div className={`flex flex-col text-center md:text-start flex-grow ${isArabic ? 'md:text-right' : 'md:text-left'}`}>
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-[#B8860B]"></span>
                            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#B8860B] dark:text-[#E5B54A]">
                                {isArabic ? 'عروض التوريد والكميات' : 'Commercial Volume Supply'}
                            </span>
                        </div>
                        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[#072835] dark:text-white leading-snug">
                            {isArabic ? 'توريد مباشر بأسعار الجملة المعتمدة' : 'Direct Supply from Certified Global Food Importers'}
                        </h2>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromoBanner;
