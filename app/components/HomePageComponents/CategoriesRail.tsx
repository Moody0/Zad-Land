'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import { useProductRail } from './useProductRail';
import Image from 'next/image';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

const STATIC_CATEGORIES = [
    { name: 'BodyCare', nameAr: 'العناية بالجسم', slug: 'bodycare', image: '/images/categories/images-(7)-Nero-AI-Image-Upscaler-Photo-Face.jpg' },
    { name: 'Eyes', nameAr: 'العيون', slug: 'eyes', image: '/images/categories/photo-2026-02-09-19-57-13.jpg' },
    { name: 'Sunscreen SPF', nameAr: 'واقي شمس', slug: 'sunscreen-spf', image: '/images/categories/Designer-(5).png' },
    { name: 'Skincare', nameAr: 'العناية بالبشرة', slug: 'skincare', image: '/images/categories/photo-2026-02-09-19-59-57.jpg' },
    { name: 'Haircare', nameAr: 'العناية بالشعر', slug: 'haircare', image: '/images/categories/Designer-(4).png' },
    { name: 'Face Makeup', nameAr: 'مكياج الوجه', slug: 'face-makeup', image: '/images/categories/Designer-(6).png' },
    { name: 'False Nails', nameAr: 'أظافر صناعية', slug: 'false-nails', image: '/images/categories/images-(6)-Nero-AI-Image-Upscaler-Photo-Face.jpg' },
    { name: 'False Lashes', nameAr: 'رموش صناعية', slug: 'false-lashes', image: '/images/categories/images-(5)-Nero-AI-Image-Upscaler-Photo-Face.jpg' },
    { name: 'Lenses', nameAr: 'عدسات لاصقة', slug: 'lenses', image: '/images/categories/Designer-(7).png' },
    { name: 'Nails Tools', nameAr: 'أدوات الأظافر', slug: 'nails-tools', image: '/images/categories/Ruby-Face-Professional-Beauty-Tools-Manicure-set-5pcs-Mauve.jpg' },
    { name: 'Nails', nameAr: 'طلاء الأظافر', slug: 'nails', image: '/images/categories/CAT-EYE-RUBY-315x315-Nero-AI-Image-Upscaler-Photo-Face.jpg' },
    { name: 'Lips', nameAr: 'الشفاه', slug: 'lips', image: '/images/categories/Designer-(3).png' },
];

const CategoriesRail = () => {
    const { dir, language } = useLanguage();
    const { railRef, canScrollForward, canScrollBackward, scrollForward, scrollBackward } = useProductRail(dir);

    const isRtl = dir === 'rtl';

    // Physically bind Left button (on the left edge) to scroll LEFT:
    const handleLeftScroll = isRtl ? scrollForward : scrollBackward;
    const isLeftDisabled = isRtl ? !canScrollForward : !canScrollBackward;

    // Physically bind Right button (on the right edge) to scroll RIGHT:
    const handleRightScroll = isRtl ? scrollBackward : scrollForward;
    const isRightDisabled = isRtl ? !canScrollBackward : !canScrollForward;

    return (
        <section className="w-full bg-white dark:bg-[#121212] pt-2 pb-2 md:pt-3 md:pb-3 border-b border-gray-100 dark:border-white/5">
            <div className="container-custom">
                <div className="relative group">
                    <div
                        ref={railRef}
                        className="-mx-4 overflow-x-auto px-4 scrollbar-hide sm:mx-0 sm:px-0"
                    >
                        <div className="flex snap-x snap-mandatory gap-6 md:gap-10 pb-2">
                            {STATIC_CATEGORIES.map((category, index) => (
                                <div key={category.slug}>
                                    <Link
                                        href={`/products?category=${category.slug}`}
                                        className="flex flex-col items-center gap-2 w-[100px] md:w-[120px] flex-none snap-start group/card"
                                    >
                                        <div className="w-[64px] h-[64px] md:w-[84px] md:h-[84px] rounded-full p-0.5 transition-all duration-300 border border-gray-200 dark:border-white/10 group-hover/card:border-zinc-900 dark:group-hover/card:border-white shrink-0">
                                            <div className="w-full h-full rounded-full overflow-hidden relative bg-gray-50 dark:bg-zinc-900">
                                                <Image
                                                    src={category.image}
                                                    alt={category.name}
                                                    fill
                                                    quality={60}
                                                    priority={index < 4}
                                                    sizes="(max-width: 768px) 60px, 80px"
                                                    className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                                                />
                                            </div>
                                        </div>
                                        <h3 className="text-[15px] font-medium text-center text-gray-700 dark:text-gray-300 group-hover/card:text-zinc-900 dark:group-hover/card:text-white transition-colors duration-200 flex items-center gap-1">
                                            <span>{language === 'ar' ? category.nameAr : category.name}</span>
                                            <svg 
                                                className={`w-3.5 h-3.5 opacity-0 -translate-x-1.5 group-hover/card:opacity-100 group-hover/card:translate-x-0 transition-all duration-500 ease-out ${dir === 'rtl' ? 'rotate-180' : ''}`} 
                                                viewBox="0 0 20 20" 
                                                fill="none" 
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M7.5 3.75L13.75 10L7.5 16.25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>
                                        </h3>
                                    </Link>
                                </div>
                            ))}
                            {/* Spacer for mobile */}
                            <div className="w-[1px] shrink-0 sm:hidden"></div>
                        </div>
                    </div>

                    {/* Desktop Navigation Arrows (Centred on circular images, top-10) */}
                    <button
                        onClick={handleLeftScroll}
                        disabled={isLeftDisabled}
                        className="hidden md:flex !absolute top-1/2 -translate-y-1/2 -left-5 z-20 w-9 h-9 rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 text-zinc-900 dark:text-white hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black shadow-md items-center justify-center transition-all cursor-pointer disabled:opacity-0 disabled:pointer-events-none"
                    >
                        <MdChevronLeft className="text-2xl" />
                    </button>
                    
                    <button
                        onClick={handleRightScroll}
                        disabled={isRightDisabled}
                        className="hidden md:flex !absolute top-1/2 -translate-y-1/2 -right-5 z-20 w-9 h-9 rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 text-zinc-900 dark:text-white hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black shadow-md items-center justify-center transition-all cursor-pointer disabled:opacity-0 disabled:pointer-events-none"
                    >
                        <MdChevronRight className="text-2xl" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CategoriesRail;
