'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
    language?: 'en' | 'ar';
}

interface CategoryCardItem {
    id: string;
    slug: string;
    titleAr: string;
    titleEn: string;
    // File paths ready for user to replace with high-resolution assets
    image: string;
    link: string;
}

// 4 Signature categories matching reference design exactly
const CATEGORIES: CategoryCardItem[] = [
    {
        id: 'canned-goods',
        slug: 'canned-goods',
        titleAr: 'المعلبات\nوالمواد الغذائية',
        titleEn: 'Canned Goods\n& Foodstuffs',
        image: '/images/categories/canned-goods.png',
        link: '/department/canned-goods',
    },
    {
        id: 'pasta-grains',
        slug: 'pasta-grains',
        titleAr: 'الزيوت والأرز\nوالمعكرونة',
        titleEn: 'Oils, Rice\n& Pasta',
        image: '/images/categories/pasta-grains.png',
        link: '/department/pasta-grains',
    },
    {
        id: 'personal-care-hygiene',
        slug: 'personal-care-hygiene',
        titleAr: 'المنظفات\nومستلزمات المنزل',
        titleEn: 'Detergents\n& Home Care',
        image: '/images/categories/cleaning-supplies.png',
        link: '/department/personal-care-hygiene',
    },
    {
        id: 'snacks-sweets',
        slug: 'snacks-sweets',
        titleAr: 'الوجبات الخفيفة\nوالمكسرات',
        titleEn: 'Snacks\n& Nuts',
        image: '/images/categories/snacks-nuts.png',
        link: '/department/snacks-sweets',
    },
];

const CategoryHighlightCards = ({ cards = [], language = 'ar' }: CategoryHighlightCardsProps) => {
    const isArabic = language === 'ar';

    return (
        <section className="container-custom px-2.5 sm:px-3.5 md:px-4 py-1 sm:py-2 md:py-4">
            {/* 4 Cards Grid - Fits 4-in-a-row matching Reference Screenshot UI */}
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3 md:gap-5 lg:gap-6 [direction:ltr]">
                {CATEGORIES.map((cat) => {
                    const title = isArabic ? cat.titleAr : cat.titleEn;
                    return (
                        <Link
                            key={cat.id}
                            href={cat.link}
                            className="group relative flex flex-col w-full aspect-[100/136] sm:aspect-[100/132] md:aspect-[1/1.22] lg:aspect-[1/1.18] md:min-h-[250px] lg:min-h-[300px] xl:min-h-[340px] bg-[#FAF6ED] dark:bg-[#1E1E16] rounded-2xl sm:rounded-[22px] md:rounded-3xl lg:rounded-[32px] overflow-hidden border border-[#B8860B]/20 hover:border-[#B8860B]/60 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 active:scale-98 text-center [direction:rtl]"
                        >
                            {/* Top Image: Full-bleed top portion with increased height */}
                            <div className="relative w-full h-[68%] sm:h-[70%] overflow-hidden rounded-t-2xl sm:rounded-t-[22px] md:rounded-t-3xl lg:rounded-t-[32px] bg-[#FAF6ED] dark:bg-[#1E1E16]">
                                <Image
                                    src={cat.image}
                                    alt={title.replace('\n', ' ')}
                                    fill
                                    priority
                                    sizes="(max-width: 768px) 25vw, 350px"
                                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            {/* Bottom Text: Pure cream background with 2 lines of bold, larger Arabic typography */}
                            <div className="w-full h-[32%] sm:h-[30%] flex items-center justify-center px-1 sm:px-2 md:px-4 pb-1 sm:pb-2 text-center bg-[#FAF6ED] dark:bg-[#1E1E16]">
                                <h3 className="text-[11.5px] sm:text-[13.5px] md:text-base lg:text-lg xl:text-xl font-black text-[#072835] dark:text-gray-100 text-center leading-[1.25] sm:leading-[1.3] md:leading-[1.35] whitespace-pre-line group-hover:text-[#B8860B] transition-colors">
                                    {title}
                                </h3>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default CategoryHighlightCards;
