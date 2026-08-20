'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import ResilientImage from '@/app/components/ResilientImage';
import { motion } from 'framer-motion';

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    brandId: string;
    isFeatured: boolean;
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

    const formatCategoryTitle = (category: Category) => {
        if (!isArabic) {
            if (category.description && !/[\u0600-\u06FF]/.test(category.description)) {
                return category.description;
            }
            if (category.slug) {
                return category.slug
                    .split('-')
                    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                    .join(' ');
            }
        }
        return category.name;
    };

    return (
        <section className="container-custom py-6 md:py-14">
            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                    visible: { transition: { staggerChildren: 0.05 } }
                }}
                className={`flex flex-col md:flex-row gap-3 ${dir === 'rtl' ? '' : 'md:flex-row-reverse'}`}
            >
                {/* Hero Card - Navigation to All Categories */}
                <motion.div 
                    variants={{
                        hidden: { opacity: 0, scale: 0.95 },
                        visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
                    }}
                    className="w-full md:w-1/2 lg:w-2/5 xl:w-1/3"
                >
                    <Link
                        href="/products"
                        className="group relative block w-full h-[220px] md:h-full rounded-2xl overflow-hidden bg-[#072835] shadow-xs"
                    >
                        {/* Background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#072835] to-[#0a3a4d]" />

                        {/* Content Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 py-6">
                            <span className="text-[11px] font-bold text-[#E5B54A] uppercase tracking-widest mb-1.5">
                                {isArabic ? 'منتجات أصلية معتمدة' : 'Verified Wholesale'}
                            </span>
                            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight">
                                {isArabic ? 'أهم الفئات والأكثر طلباً' : 'Top Categories & Best Sellers'}
                            </h2>
                            <p className="text-xs md:text-sm text-white/80 max-w-[280px] mb-4">
                                {isArabic
                                    ? 'من المواد الغذائية إلى المعلبات والحلويات، اكتشف أفضل المنتجات العالمية'
                                    : 'From premium foods to canned goods and sweets, discover top global brands'}
                            </p>
                            <span className="px-6 py-2 bg-[#B8860B] hover:bg-[#9E7309] text-white font-bold text-xs md:text-sm rounded-full transition-transform group-hover:scale-105 shadow-xs">
                                {isArabic ? 'تصفح كافة الأقسام' : 'Explore All Categories'}
                            </span>
                        </div>
                    </Link>
                </motion.div>

                {/* Category Cards Grid - Responsive 2 columns on mobile for maximum legibility */}
                <div className="flex-1">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
                        {categories.slice(0, 12).map((category) => (
                            <motion.div
                                key={category.id}
                                variants={{
                                    hidden: { opacity: 0, scale: 0.8, y: 20 },
                                    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
                                }}
                            >
                                <Link
                                    href={`/products?category=${category.slug}`}
                                    className="group relative block aspect-square rounded-xl overflow-hidden h-full w-full border border-gray-200/60 dark:border-white/5 hover:border-[#B8860B]/80 transition-all duration-300 shadow-2xs"
                                >
                                    {/* Category Image */}
                                    {category.image ? (
                                        <ResilientImage
                                            src={category.image}
                                            alt={formatCategoryTitle(category)}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
                                    )}

                                    {/* Bottom gradient overlay */}
                                    <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                    {/* Category Name */}
                                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-2.5 px-2">
                                        <span className="text-white text-xs sm:text-sm font-bold text-center leading-snug group-hover:text-[#E5B54A] transition-colors drop-shadow-xs line-clamp-2">
                                            {formatCategoryTitle(category)}
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default FeaturedCategoriesGrid;
