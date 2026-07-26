import React from 'react';
import dynamic from 'next/dynamic';
import type { HomeBrand } from '@/lib/admin-actions';
import CategoriesRail from './CategoriesRail';

import FeaturedCollection from './FeaturedCollection';
import PromoBanner from './PromoBanner';
import CountdownOffer from './CountdownOffer';
import TrendingWeekly from './TrendingWeekly';
import FeaturedCategoriesGrid from './FeaturedCategoriesGrid';
import CategoryHighlightCards from './CategoryHighlightCards';
import TestimonialsMasonry from './TestimonialsMasonry';
import ScrollReveal from '../ScrollReveal';

const HeroCarousel = dynamic(() => import('./HeroCarousel'), {
    ssr: true,
});

interface Banner {
    id: string;
    title: string | null;
    subtitle: string | null;
    titleAr: string | null;
    subtitleAr: string | null;
    image: string;
    buttonText: string | null;
    link: string | null;
    badge: string | null;
    isActive: boolean;
}

interface Product {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    price: number;
    discountPrice?: number | null;
    images: string;
    categoryId: string;
    stock: number;
    isTrending: boolean;
    category: {
        name: string;
    } | null;
    brand?: {
        id: string;
        name: string;
        slug: string;
        group?: string;
    } | null;
}

interface FeaturedCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    brandId: string;
    isFeatured: boolean;
}

interface MainProps {
    banners: Banner[];
    mainBrands: HomeBrand[];
    featuredNewArrivals: Product[];
    featuredBundles: Product[];
    featuredBestSellers: Product[];
    trendingWeekly: Product[];
    featuredCategories: FeaturedCategory[];
    settings: any;
}

const Main = async ({ banners, mainBrands, featuredNewArrivals, featuredBundles, featuredBestSellers, trendingWeekly, featuredCategories, settings }: MainProps) => {
    return (
        <main className="w-full flex flex-col gap-y-[40px] md:gap-y-[80px] pb-12">
            {/* Group Hero Carousel and Categories Rail close to each other */}
            <div className="flex flex-col gap-y-0">
                {/* 1. Hero Carousel Section */}
                <HeroCarousel banners={banners} />

                {/* 2. Categories Rail (12 Custom Circular Items) */}
                <CategoriesRail />
            </div>

            {/* 3. First Ad - Placed above CategoryHighlightCards */}
            <PromoBanner />

            {/* 4. Main Categories (4 highlight cards - تسوق حسب الفئة) */}
            <ScrollReveal>
                <CategoryHighlightCards mainBrands={mainBrands} />
            </ScrollReveal>

            {/* 5. Countdown Offer Section - Placed directly below CategoryHighlightCards */}
            <ScrollReveal>
                <CountdownOffer />
            </ScrollReveal>

            {/* 6. الجديد والمحبوب (New Arrivals & Best Sellers) */}
            <ScrollReveal>
                <FeaturedCollection
                    newArrivals={featuredNewArrivals}
                    bundles={featuredBundles}
                    bestSellers={featuredBestSellers}
                />
            </ScrollReveal>

            {/* Featured Categories Grid (Top Categories. Best Sellers) */}
            <ScrollReveal>
                <FeaturedCategoriesGrid categories={featuredCategories} />
            </ScrollReveal>

            {/* 7. Trending This Week - Horizontal Product Cards */}
            <ScrollReveal>
                <TrendingWeekly products={trendingWeekly} />
            </ScrollReveal>

            {/* 8. Testimonials Masonry */}
            <ScrollReveal>
                <TestimonialsMasonry products={featuredBestSellers} />
            </ScrollReveal>
        </main>
    );
};

export default Main;
