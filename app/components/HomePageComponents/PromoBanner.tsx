'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/app/context/LanguageContext';

interface PromoBannerProps {
    settings?: {
        middleBanner1Image?: string | null;
        middleBanner1Link?: string | null;
    };
}

const PromoBanner = ({ settings }: PromoBannerProps) => {
    const { t, dir } = useLanguage();

    const bannerImage = settings?.middleBanner1Image || 'https://images.unsplash.com/photo-1621996346565-e3d5d6281290?w=1200';
    const bannerLink = settings?.middleBanner1Link || '/products';

    return (
        <section className="container-custom">
            <div className="relative w-full rounded-2xl overflow-hidden h-[120px] md:h-[150px] flex items-center px-6 md:px-12 bg-[#FAF6EC] dark:bg-[#1A1A14] border border-[#B8860B]/25">
                
                {/* Content Container */}
                <div className={`w-full flex items-center justify-between z-10 ${dir === 'rtl' ? 'flex-row' : 'flex-row-reverse'}`}>

                    {/* 1. Button */}
                    <div className="flex-shrink-0 w-full md:w-auto flex justify-end">
                        <Link
                            href={bannerLink}
                            className="px-7 py-3 bg-[#2E7D32] hover:bg-[#256629] text-white rounded-full font-bold text-sm md:text-base transition-all active:scale-95 whitespace-nowrap shadow-xs"
                        >
                            {dir === 'rtl' ? 'استعراض عروض التوريد' : 'Explore Supply Deals'}
                        </Link>
                    </div>

                    {/* 2. Text Content */}
                    <div className={`hidden md:flex flex-col flex-grow px-8 md:px-12 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-[#B8860B]"></span>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#B8860B] dark:text-[#E5B54A]">
                                {dir === 'rtl' ? 'عروض التوريد والكميات' : 'Commercial Volume Supply'}
                            </span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-[#072835] dark:text-white leading-tight">
                            {dir === 'rtl' ? 'توريد مباشر بأسعار الجملة المعتمدة' : 'Direct Supply from Certified Global Food Importers'}
                        </h2>
                    </div>

                    {/* Space filler / Layout balancer on the left */}
                    <div className="hidden md:block w-12"></div>
                </div>
            </div>
        </section>
    );
};

export default PromoBanner;
