import React from 'react';
import dynamic from 'next/dynamic';
import type { HomeBrand, RailBrand } from '@/lib/admin-actions';
import BrandsRail from './BrandsRail';

import FeaturedCollection from './FeaturedCollection';
import PromoBanner from './PromoBanner';
import CountdownOffer from './CountdownOffer';
import TrendingWeekly from './TrendingWeekly';
import FeaturedCategoriesGrid from './FeaturedCategoriesGrid';
import CategoryHighlightCards from './CategoryHighlightCards';
import TestimonialsMasonry from './TestimonialsMasonry';
import ScrollReveal from '../ScrollReveal';
import { getI18n } from '@/lib/i18n';

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
    nameAr?: string | null;
    nameEn?: string | null;
    description: string | null;
    descriptionAr?: string | null;
    descriptionEn?: string | null;
    options?: string | null;
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

import type { HighlightCard } from './CategoryHighlightCards';
import type { ReviewItem } from './TestimonialsMasonry';

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
    railBrands: RailBrand[];
    highlightCards: HighlightCard[];
    reviews: ReviewItem[];
    featuredNewArrivals: Product[];
    featuredBundles: Product[];
    featuredBestSellers: Product[];
    trendingWeekly: Product[];
    featuredCategories: FeaturedCategory[];
    settings: any;
}

const Main = async ({
    banners,
    mainBrands,
    railBrands,
    highlightCards,
    reviews,
    featuredNewArrivals,
    featuredBundles,
    featuredBestSellers,
    trendingWeekly,
    featuredCategories,
    settings,
}: MainProps) => {
    const { dir, language } = await getI18n();

    return (
        <main className="w-full flex flex-col gap-y-[40px] md:gap-y-[80px] pb-12">
            {/* Group Hero Carousel and Brands Rail close to each other */}
            <div className="flex flex-col gap-y-0">
                {/* 1. Hero Carousel Section */}
                <HeroCarousel banners={banners} />

                {/* 2. Brands Rail (Dynamic from Database) */}
                <BrandsRail brands={railBrands} />
            </div>

            {/* 3. First Ad - Placed above CategoryHighlightCards */}
            <PromoBanner settings={settings} dir={dir} language={language} />

            {/* 4. Main Categories (Dynamic 4 highlight cards from Database) */}
            <ScrollReveal>
                <CategoryHighlightCards cards={highlightCards} />
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

            {/* 8. Testimonials Masonry (Dynamic Reviews from Database) */}
            <ScrollReveal>
                <TestimonialsMasonry reviews={reviews} products={featuredBestSellers} />
            </ScrollReveal>
        </main>
    );
};

export default Main;
