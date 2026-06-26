import Link from 'next/link';
import React from 'react';
import { getI18n } from '@/lib/i18n';
import type { HomeBrand } from '@/lib/admin-actions';
import { getSafeImageUrl } from '@/lib/image-utils';

interface ShopByCategoryProps {
    mainBrands: HomeBrand[];
}

// Display type that doesn't depend on Prisma enums
interface DisplayCategory {
    id: string;
    name: string;
    slug: string;
    image: string;
}

const ShopByCategory = async ({ mainBrands }: ShopByCategoryProps) => {
    const { t, language } = await getI18n();

    // Desired order for the 4 main categories
    const categoryOrder = ['ruby-beauty', 'accessories', 'watches', 'makeup'];

    const defaultImages: Record<string, string> = {
        'ruby-beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
        'makeup': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
        'perfumes': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
        'accessories': 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400',
        'watches': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
    };

    const localizedNames: Record<string, { en: string; ar: string }> = {
        'ruby-beauty': { en: 'Ruby Beauty', ar: 'روبي بيوتي' },
        'makeup': { en: 'Makeup', ar: 'مكياج' },
        'perfumes': { en: 'Perfumes', ar: 'عطور' },
        'accessories': { en: 'Accessories', ar: 'اكسسوارات' },
        'watches': { en: 'Watches', ar: 'ساعات' },
    };

    const getLocalizedName = (slug: string): string => {
        return language === 'ar'
            ? localizedNames[slug]?.ar || localizedNames[slug]?.en || slug
            : localizedNames[slug]?.en || slug;
    };

    // Build display categories in the desired order
    const displayCategories: DisplayCategory[] = categoryOrder.map(slug => {
        const brand = mainBrands.find(b => b.slug === slug);
        const image = brand?.image
            ? getSafeImageUrl(brand.image)
            : defaultImages[slug] || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400';

        return {
            id: brand?.id || slug,
            name: getLocalizedName(slug),
            slug,
            image,
        };
    });

    return (
        <section className="container-custom py-6 md:py-10">
            <div className="w-full">
                <h3 className="text-2xl md:text-3xl font-bold text-text-main-light dark:text-text-main-dark mb-8 text-center">
                    {t('home.shopByCategory')}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                    {displayCategories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/brands/${category.slug}`}
                            className="group flex flex-col items-center gap-3 transition-all duration-300"
                        >
                            {/* Card Image Container - Rectangular like the design */}
                            <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gray-50 dark:bg-white/5 shadow-sm group-hover:shadow-lg transition-shadow duration-300">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                                {/* Subtle gradient overlay on hover */}
                                <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Category Name & Shop Now CTA */}
                            <div className="flex flex-col items-center text-center gap-1">
                                <h4 className="text-sm md:text-base font-bold text-text-main-light dark:text-text-main-dark transition-colors">
                                    <span className="group-hover-underline-animated">{category.name}</span>
                                </h4>
                                <span className="text-xs text-primary font-medium">
                                    {t('home.shopNowCta')}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShopByCategory;

