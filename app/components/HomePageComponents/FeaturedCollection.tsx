'use client';

import React, { useState, useMemo } from 'react';
import ProductCard from '../ProductsPageComponents/ProductCard';
import { MdChevronRight, MdChevronLeft } from 'react-icons/md';
import { motion } from 'framer-motion';

import { useLanguage } from '@/app/context/LanguageContext';
import { useProductRail } from './useProductRail';

interface Product {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    price: number;
    discountPrice?: number | null;
    images: string;
    categoryId: string;
    isTrending: boolean;
    stock: number;
    brand?: {
        id: string;
        name: string;
        slug: string;
        group?: string;
    } | null;
}

interface TabData {
    key: string;
    labelKey: string;
    products: Product[];
}

interface FeaturedCollectionProps {
    newArrivals: Product[];
    bundles: Product[];
    bestSellers: Product[];
}

const CARD_WIDTH = 320;
const CARD_GAP = 20;

const FeaturedCollection = ({ newArrivals, bundles, bestSellers }: FeaturedCollectionProps) => {
    const { t, dir } = useLanguage();
    const [activeTab, setActiveTab] = useState(0);

    const { railRef, progressBarRef, canScrollForward, canScrollBackward, scrollForward, scrollBackward } = useProductRail(dir);

    const tabs: TabData[] = useMemo(() => [
        { key: 'new-arrivals', labelKey: 'home.featuredTabNewArrivals', products: newArrivals },
        { key: 'best-sellers', labelKey: 'home.featuredTabBestSellers', products: bestSellers },
    ], [newArrivals, bestSellers]);

    const activeProducts = tabs[activeTab]?.products || [];

    React.useEffect(() => {
        if (railRef.current) {
            railRef.current.scrollTo({ left: 0, behavior: 'auto' });
        }
    }, [activeTab]);

    if (!newArrivals.length && !bundles.length && !bestSellers.length) {
        return null;
    }

    return (
        <section className="container-custom">
            <div 
                className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 px-2"
            >
                <div className="flex-1">
                    <h2 className="text-lg sm:text-xl md:text-[32px] font-semibold text-[rgb(46,46,46)] dark:text-text-main-dark">
                        {t('home.featuredCollection')}
                    </h2>
                    <p className="text-[15px] text-[rgb(46,46,46)] mt-1">
                        {t('home.featuredCollectionSubtitle')}
                    </p>
                </div>

                <div className="tabs-nav overflow-x-auto scrollbar-hide" role="tablist">
                    <div className="flex md:justify-end gap-4 md:gap-2">
                        {tabs.map((tab, index) => (
                            <button
                                key={tab.key}
                                role="tab"
                                aria-selected={activeTab === index}
                                onClick={() => setActiveTab(index)}
                                className={`tabs__btn whitespace-nowrap px-8 py-3 text-[15px] font-medium transition-all border-b-2 ${activeTab === index
                                    ? 'border-[rgb(46,46,46)] text-[rgb(46,46,46)]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                            >
                                {t(tab.labelKey)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="relative">
                <div
                    ref={railRef}
                    className="-mx-4 overflow-x-auto px-4 scrollbar-hide sm:mx-0 sm:px-0"
                >
                    <div className="flex snap-x snap-mandatory gap-4 pb-2 md:gap-5">
                        {activeProducts.map((product) => (
                            <div
                                key={product.id}
                                className="w-[180px] md:w-[calc((100%-40px)/3)] xl:w-[calc((100%-60px)/4)] 2xl:w-[calc((100%-80px)/5)] flex-none snap-start"
                            >
                                <ProductCard
                                    product={product}
                                    variant="compact"
                                    showBadge={activeTab === 0}
                                    badge={activeTab === 0 ? t('home.newArrival') : undefined}
                                />
                            </div>
                        ))}
                        {/* Spacer to prevent cutoff of the last item on mobile */}
                        <div className="w-[1px] shrink-0 sm:hidden"></div>
                    </div>
                </div>
                
                {/* Bottom Navigation and Progress Bar */}
                <div className="mt-8 flex items-center gap-4 px-2 w-full">
                    {/* Previous Button (White -> Dark Hover) */}
                    <button
                        onClick={scrollBackward}
                        disabled={!canScrollBackward}
                        className="hidden md:flex w-12 h-12 shrink-0 rounded-full border border-gray-200 bg-white items-center justify-center text-[#000000] disabled:opacity-50 disabled:cursor-not-allowed order-2 btn-curved-fill"
                        aria-label="Previous slide"
                    >
                        <svg className={`w-5 h-5 ${dir === 'rtl' ? '-scale-x-100' : ''}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.5 16.25L6.25 10L12.5 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </button>
                    
                    {/* Progress Bar */}
                    <div className="flex-1 h-[2px] bg-gray-200 dark:bg-gray-800 relative overflow-hidden rounded-full order-1">
                        <div 
                            ref={progressBarRef}
                            className="absolute top-0 bottom-0 bg-[#000000] dark:bg-gray-300 rounded-full"
                            style={{ 
                                width: '100%',
                                transformOrigin: dir === 'rtl' ? 'right' : 'left',
                                transform: 'scaleX(0)'
                            }}
                        />
                    </div>

                    {/* Next Button (White -> Dark Hover) */}
                    <button
                        onClick={scrollForward}
                        disabled={!canScrollForward}
                        className="hidden md:flex w-12 h-12 shrink-0 rounded-full border border-gray-200 bg-white items-center justify-center text-[#000000] disabled:opacity-50 disabled:cursor-not-allowed order-3 btn-curved-fill"
                        aria-label="Next slide"
                    >
                        <svg className={`w-5 h-5 ${dir === 'rtl' ? '-scale-x-100' : ''}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 3.75L13.75 10L7.5 16.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FeaturedCollection;
