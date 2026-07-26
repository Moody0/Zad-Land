'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/app/context/LanguageContext';

const PromoBanner = () => {
    const { t, dir } = useLanguage();

    return (
        <section className="container-custom">
            <div className="relative w-full rounded-[10px] overflow-hidden h-[108px] md:h-[160px] flex items-center px-6 md:px-16">
                
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200" 
                        alt="Promo Background" 
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 100vw"
                        className="object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-[#fce7ed]/80 dark:bg-[#2d161e]/80" />
                </div>

                {/* Content Container */}
                <div className={`w-full flex items-center justify-between z-10 ${dir === 'rtl' ? 'flex-row' : 'flex-row-reverse'}`}>

                    {/* 1. Button (Always visible, on the right) */}
                    <div className="flex-shrink-0 w-full md:w-auto flex justify-end">
                        <Link
                            href="/products"
                            className="px-8 py-3 bg-black text-white hover:bg-white hover:text-black border border-transparent hover:border-black rounded-full font-bold text-sm md:text-base transition-all shadow-lg active:scale-95 whitespace-nowrap"
                        >
                            {dir === 'rtl' ? 'تسوق الآن' : 'Shop Now'}
                        </Link>
                    </div>

                    {/* 2. Text Content (Desktop only, in the middle) */}
                    <div className={`hidden md:flex flex-col flex-grow px-8 md:px-16 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                        <h2 className="text-2xl md:text-4xl font-bold text-[#1a1a1a] dark:text-white mb-1">
                            {dir === 'rtl' ? 'خصومات تصل إلى 30%' : 'Discounts up to 30%'}
                        </h2>
                        <p className="text-sm md:text-lg text-[#666666] dark:text-white/80 font-medium">
                            {dir === 'rtl' ? 'على مجموعة مختارة من المنتجات' : 'On a selected range of products'}
                        </p>
                    </div>

                    {/* Space filler / Layout balancer on the left */}
                    <div className="hidden md:block w-32 md:w-64"></div>
                </div>
            </div>
        </section>
    );
};

export default PromoBanner;
