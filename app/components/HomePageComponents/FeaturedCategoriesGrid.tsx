'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import ResilientImage from '@/app/components/ResilientImage';
import { motion } from 'framer-motion';
import { MdChevronRight } from 'react-icons/md';

interface Category {
    id: string;
    name: string;
    nameEn?: string;
    slug: string;
    description: string | null;
    image: string | null;
    brandId: string;
    isFeatured: boolean;
    brand?: {
        id: string;
        name: string;
        slug: string;
    } | null;
}

interface FeaturedCategoriesGridProps {
    categories: Category[];
}

const FeaturedCategoriesGrid = ({ categories }: FeaturedCategoriesGridProps) => {
    const { language, dir } = useLanguage();
    const isArabic = language === 'ar';

    if (!categories || categories.length === 0) {
        return null;
    }

    const getDisplayName = (cat: Category) => {
        if (isArabic) {
            return cat.name;
        }
        return cat.description || cat.nameEn || cat.name;
    };

    const getBrandName = (cat: Category) => {
        if (!cat.brand?.name) return null;
        if (isArabic) {
            return cat.brand.name.split('-')[1]?.trim() || cat.brand.name.split('-')[0]?.trim();
        }
        return cat.brand.name.split('-')[0]?.trim();
    };

    return (
        <section className="container-custom py-6 md:py-12">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 gap-4 px-1">
                <div>
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#B8860B] dark:text-[#E5B54A] block mb-1">
                        {isArabic ? 'كتالوج التوريد والمنتجات المعتمدة' : 'Verified Wholesale Catalog'}
                    </span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#072835] dark:text-white leading-tight">
                        {isArabic ? 'أهم الفئات والأكثر طلباً' : 'Top Categories & Best Sellers'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1 max-w-xl">
                        {isArabic
                            ? 'مستوردة وموزعة مباشرة من كبرى المصانع العالمية مع أفضل خصومات الجملة.'
                            : 'Sourced directly from certified global food manufacturers with bulk wholesale pricing.'}
                    </p>
                </div>

                <Link
                    href="/products"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#072835] dark:text-[#E5B54A] hover:text-[#B8860B] transition-colors whitespace-nowrap self-start md:self-end"
                >
                    <span>{isArabic ? 'تصفح كافة الأقسام' : 'View All Categories'}</span>
                    <MdChevronRight className={`text-lg transition-transform ${isArabic ? 'rotate-180' : ''}`} />
                </Link>
            </div>

            {/* Symmetrical 5-Column Grid on Desktop, 2-Column on Mobile */}
            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                    visible: { transition: { staggerChildren: 0.04 } }
                }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5"
            >
                {categories.map((category) => {
                    const brandName = getBrandName(category);
                    const displayName = getDisplayName(category);

                    return (
                        <motion.div
                            key={category.id}
                            variants={{
                                hidden: { opacity: 0, scale: 0.95, y: 15 },
                                visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
                            }}
                        >
                            <Link
                                href={`/products?category=${category.slug}`}
                                className="group relative flex flex-col h-full bg-[#FAF9F5] dark:bg-[#1E1E16] rounded-2xl overflow-hidden border border-[#B8860B]/15 hover:border-[#B8860B]/50 transition-all duration-300 hover:shadow-md p-2.5 sm:p-3.5"
                            >
                                {/* Category Image Container */}
                                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 mb-2.5 flex items-center justify-center p-2">
                                    {category.image ? (
                                        <ResilientImage
                                            src={category.image}
                                            alt={displayName}
                                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 dark:bg-zinc-800 rounded-lg" />
                                    )}
                                </div>

                                {/* Content Details */}
                                <div className="flex flex-col flex-1 justify-between text-center px-1 pb-1">
                                    <div>
                                        {brandName && (
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8860B] dark:text-[#E5B54A] block mb-0.5 truncate">
                                                {brandName}
                                            </span>
                                        )}
                                        <h3 className="text-xs sm:text-sm font-bold text-[#072835] dark:text-white leading-snug group-hover:text-[#B8860B] transition-colors line-clamp-2">
                                            {displayName}
                                        </h3>
                                    </div>

                                    <div className="mt-2 pt-2 border-t border-gray-200/50 dark:border-white/5 flex items-center justify-center gap-1 text-[11px] font-semibold text-[#2E7D32] dark:text-[#4ade80] opacity-90 group-hover:opacity-100">
                                        <span>{isArabic ? 'تسوق القسم' : 'Shop Category'}</span>
                                        <span className={`transition-transform duration-300 group-hover:translate-x-1 ${isArabic ? 'rotate-180 group-hover:-translate-x-1' : ''}`}>➔</span>
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

export default FeaturedCategoriesGrid;
