'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import ResilientImage from '@/app/components/ResilientImage';
import { motion } from 'framer-motion';

export interface HighlightCard {
    id: string;
    slug: string;
    subheadingAr: string;
    subheadingEn: string;
    headingAr: string;
    headingEn: string;
    productNameAr: string;
    productNameEn: string;
    priceText: string;
    heroImage: string;
    productThumb: string;
    productSlug?: string;
}

interface CategoryHighlightCardsProps {
    cards?: HighlightCard[];
}

const CategoryHighlightCards = ({ cards = [] }: CategoryHighlightCardsProps) => {
    const { language } = useLanguage();

    if (!cards || cards.length === 0) {
        return null;
    }

    return (
        <section className="container-custom">
            {/* Section Title */}
            <div className="flex justify-center mb-6 md:mb-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-xl md:text-2xl lg:text-[28px] font-bold text-[rgb(46,46,46)] dark:text-white tracking-tight">
                    {language === 'ar' ? 'تسوق حسب الفئة' : 'Shop By Category'}
                </h2>
            </div>

            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                    visible: { transition: { staggerChildren: 0.15 } }
                }}
                className="flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible"
            >
                {cards.map((card) => {
                    const categoryName = language === 'ar' ? card.subheadingAr : card.subheadingEn;
                    const heroImage = card.heroImage || '/placeholder.svg';

                    return (
                        <motion.div
                            key={card.id || card.slug}
                            variants={{
                                hidden: { opacity: 0, y: 40 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
                            }}
                            className="flex-none w-[170px] sm:w-[190px] md:flex-1 min-w-0 snap-start"
                        >
                            <Link
                                href={`/department/${card.slug}`}
                                className="group relative block w-full bg-[#FDFCF8] dark:bg-[#1a1a1a] rounded-[14px] overflow-hidden border border-gray-200/70 dark:border-white/5 hover:border-[#B8860B]/50 hover:shadow-md transition-all duration-300"
                            >
                                {/* Image Container */}
                                <div className="relative w-full aspect-square overflow-hidden bg-[#F7F5F0] dark:bg-[#222]">
                                    <ResilientImage
                                        src={heroImage}
                                        alt={categoryName}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                        loading="lazy"
                                    />
                                </div>

                                {/* Text Content */}
                                <div className="p-3 sm:p-4 md:p-5 flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-[13px] sm:text-[14px] md:text-[17px] font-bold text-[#072835] dark:text-white leading-tight group-hover:text-[#B8860B] transition-colors line-clamp-1">
                                            {categoryName}
                                        </h3>
                                        <p className="text-[10px] md:text-xs text-[#2E7D32] dark:text-[#4ade80] font-semibold leading-none">
                                            {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
                                        </p>
                                    </div>

                                    {/* Outline Icon */}
                                    <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full border-[1.5px] border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-all duration-300 group-hover:border-[#B8860B] group-hover:bg-[#B8860B] group-hover:text-white">
                                        <svg className={`w-3 h-3 md:w-4 md:h-4 ${language === 'ar' ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
};

export default CategoryHighlightCards;
