'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MdChevronRight } from 'react-icons/md';
import { useLanguage } from '@/app/context/LanguageContext';
import { useCurrency } from '@/app/context/CurrencyContext';
import ResilientImage from '@/app/components/ResilientImage';
import { motion } from 'framer-motion';

interface Product {
    id: string;
    slug: string;
    name: string;
    nameAr?: string | null;
    nameEn?: string | null;
    description: string | null;
    price: number;
    discountPrice?: number | null;
    images: string;
    categoryId: string;
    stock: number;
    isTrending: boolean;
    brand?: {
        id: string;
        name: string;
        slug: string;
        group?: string;
    } | null;
}

interface TrendingWeeklyProps {
    products: Product[];
}

const TrendingWeekly = ({ products }: TrendingWeeklyProps) => {
    const { t, dir, language } = useLanguage();
    const [showAll, setShowAll] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    React.useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    if (!products || products.length === 0) {
        return null;
    }

    // On mobile, show 5 by default, expand to all on 'More' press
    const visibleProducts = (isMobile && !showAll) ? products.slice(0, 5) : products;

    const getFirstImage = (images: string) => {
        try {
            const parsed = JSON.parse(images);
            return Array.isArray(parsed) ? parsed[0] : images;
        } catch {
            return images.split(',')[0]?.trim() || images;
        }
    };

    const { formatPrice } = useCurrency();

    return (
        <section className="container-custom">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, x: dir === 'rtl' ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={`flex flex-col md:flex-row md:items-center md:justify-between mb-8 px-2 gap-2 ${dir === 'rtl' ? 'items-start md:items-center' : 'items-start md:items-center'}`}
            >
                <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold text-[rgb(46,46,46)] dark:text-white ${dir === 'rtl' ? 'text-right w-full' : 'text-left w-full'}`}>
                    {language === 'ar' ? 'تريندات هذا الاسبوع' : 'Trending This Week'}
                </h2>
                <Link
                    href="/products"
                    className="flex items-center gap-1 text-sm font-medium text-[rgb(46,46,46)] text-opacity-80 dark:text-white transition-colors group whitespace-nowrap"
                >
                    <span className="group-hover-underline-animated">
                        {language === 'ar' ? 'تسوق كل المنتجات' : 'Shop All Products'}
                    </span>
                    <MdChevronRight className={`text-lg transition-transform group-hover:translate-x-0.5 ${dir === 'rtl' ? 'rotate-180 group-hover:-translate-x-0.5' : ''}`} />
                </Link>
            </motion.div>

            {/* Product Grid */}
            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                    visible: { transition: { staggerChildren: 0.08 } }
                }}
                className="relative"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    {visibleProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            variants={{
                                hidden: { opacity: 0, scale: 0.9, y: 20 },
                                visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
                            }}
                            className="group flex items-center gap-4 bg-[#F7F7F2] dark:bg-[#22221A] border border-[#B8860B]/10 hover:border-[#B8860B]/40 rounded-[12px] p-3 md:p-4 h-[112px] transition-all duration-300 shadow-xs hover:shadow-sm"
                        >
                            {/* Product Image */}
                            <Link
                                href={`/products/${product.slug}`}
                                className="w-[86px] h-[86px] shrink-0 rounded-lg overflow-hidden bg-white p-1 border border-gray-100 dark:border-white/5"
                            >
                                <ResilientImage
                                    src={getFirstImage(product.images)}
                                    alt={product.name}
                                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                            </Link>

                            {/* Product Info */}
                            <div className={`flex-1 min-w-0 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                                {/* Brand */}
                                {product.brand && (
                                    <p className="text-[11px] md:text-[12px] font-bold text-[#B8860B] dark:text-[#E5B54A] mb-0.5 truncate uppercase">
                                        {product.brand.name.toUpperCase()}
                                    </p>
                                )}
                                {/* Product Name */}
                                <h3 className={`text-[12px] md:text-[15px] font-semibold text-[#072835] dark:text-white truncate leading-tight mb-1 font-sans tracking-normal ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                                    <Link
                                        href={`/products/${product.slug}`}
                                        className="hover-underline-animated"
                                    >
                                        {language === 'ar' ? (product.nameAr || product.name) : (product.nameEn || product.name)}
                                    </Link>
                                </h3>
                                {/* Price */}
                                <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row' : 'flex-row'}`}>
                                    {product.discountPrice ? (
                                        <>
                                            <span className="text-sm md:text-base font-extrabold text-[#2E7D32] dark:text-[#4ade80]">
                                                {formatPrice(Number(product.discountPrice))}
                                            </span>
                                            <span className="text-xs text-gray-400 line-through">
                                                {formatPrice(Number(product.price))}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-sm md:text-base font-extrabold text-[#072835] dark:text-white">
                                            {formatPrice(Number(product.price))}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Arrow Button */}
                            <Link
                                href={`/products/${product.slug}`}
                                className="shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 flex items-center justify-center transition-all group-hover:bg-[#B8860B] group-hover:border-[#B8860B] group-hover:text-white"
                            >
                                <svg className={`w-3.5 h-3.5 ${dir === 'rtl' ? '' : 'rotate-180'}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.5 16.25L6.25 10L12.5 3.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Fade-out gradient on the last product when collapsed on mobile */}
                {isMobile && !showAll && products.length > 5 && (
                    <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-gradient-to-t from-white dark:from-[#0a0a0a] to-transparent pointer-events-none md:hidden" />
                )}
            </motion.div>

            {/* Mobile Show More/Less Button */}
            {products.length > 5 && (
                <div className="flex justify-center mt-6 md:hidden">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="px-8 py-3 bg-black text-white rounded-full font-bold text-sm transition-all active:scale-95"
                    >
                        {showAll
                            ? (language === 'ar' ? 'أقل' : 'Less')
                            : (language === 'ar' ? 'أكثر' : 'More')
                        }
                    </button>
                </div>
            )}
        </section>
    );
};

export default TrendingWeekly;
