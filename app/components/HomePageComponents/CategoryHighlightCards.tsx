'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import ResilientImage from '@/app/components/ResilientImage';
import { motion } from 'framer-motion';

interface HomeBrand {
    id: string;
    name: string;
    slug: string;
    image: string | null;
}

interface CategoryHighlightCardsProps {
    mainBrands: HomeBrand[];
}

/*
 * Each card matches the scroll.html reference:
 *  - A tall image (3:4) with dark overlay
 *  - Subheading + heading at the TOP of the card
 *  - Mini product row at the BOTTOM (overlaid on image) with thumbnail, name, price, button
 */
const CARD_DATA = [
    {
        slug: 'ruby-beauty',
        subheadingAr: 'مجموعة',
        subheadingEn: 'Collection',
        headingAr: 'الحجم الصغير و الاساسية',
        headingEn: 'Mini & Essentials',
        productNameAr: 'الروتين السهل',
        productNameEn: 'The Clear Routine',
        priceText: 'ل.س ٧٨٥.٤٠',
        oldPriceText: 'SYP 939.00',
        btnAr: 'اشتري',
        btnEn: 'Buy',
        heroImage: 'https://sourcebeauty.com/cdn/shop/files/The-Clear-Routine-source-beauty-egypt_1d0c19ab-dd70-46cd-aa95-4ce07258d6dd.png?v=1778661109&width=750',
        productThumb: 'https://sourcebeauty.com/cdn/shop/files/The-Clear-Routine-source-beauty-egypt.png?v=1778060994&width=140',
    },
    {
        slug: 'perfumes',
        subheadingAr: 'عطور',
        subheadingEn: 'Perfume',
        headingAr: 'رائحة الورد الخفيفة',
        headingEn: 'Light Rose Scent',
        productNameAr: 'برفان المسك الخشبي',
        productNameEn: 'Woody Musk Perfume',
        priceText: 'ل.س ٤٧٥.٠٠',
        oldPriceText: '',
        btnAr: 'تسوق',
        btnEn: 'Shop',
        heroImage: 'https://sourcebeauty.com/cdn/shop/files/Source-beauty-perfumes-product-highlight-Homepage-Section_93e68752-6b29-473b-929f-1fb225fb5705_1.webp?v=1774954702&width=750',
        productThumb: 'https://sourcebeauty.com/cdn/shop/files/Woody-Musk-Perfume-New-Packaging-Source-Beauty-Egypt.png?v=1760867648&width=140',
    },
    {
        slug: 'makeup',
        subheadingAr: 'واقي شمس',
        subheadingEn: 'Sunscreen',
        headingAr: 'حماية من الشمس',
        headingEn: 'Sun Protection',
        productNameAr: 'جل واقي شمس سوبر شير ١+١',
        productNameEn: 'Super Sheer Sunscreen Gel',
        priceText: 'ل.س ٤٧٥.٠٠',
        oldPriceText: '',
        btnAr: 'تسوق',
        btnEn: 'Shop',
        heroImage: 'https://sourcebeauty.com/cdn/shop/files/Nano-treat-products-highlight.webp?v=1777581882&width=750',
        productThumb: 'https://sourcebeauty.com/cdn/shop/files/NanoTreat-Super-Sheer-SunScreen-Gel-Offer-For-1_1-Free-Source-Beauty-Egypt.png?v=1774880845&width=140',
    },
    {
        slug: 'accessories',
        subheadingAr: 'اكسسوارات',
        subheadingEn: 'Accessories',
        headingAr: 'لمسة من الأناقة',
        headingEn: 'A Touch of Elegance',
        priceText: '',
        oldPriceText: '',
        btnAr: 'تسوق',
        btnEn: 'Buy',
        heroImage: 'https://sourcebeauty.com/cdn/shop/files/Fino-products-highlight.webp?v=1774954050&width=750',
        productThumb: 'https://sourcebeauty.com/cdn/shop/files/Fino-Premium-Touch-moist-repair-Shampoo-550ml-Moisturizing-source-beauty-egypt_a1309549-dc8b-4a7c-a1e8-9c5b29f7bbb5.png?v=1755009326&width=140',
    },
    {
        slug: 'watches',
        subheadingAr: 'ساعات',
        subheadingEn: 'Watches',
        headingAr: 'تألقي في كل وقت',
        headingEn: 'Shine Every Time',
        priceText: '',
        oldPriceText: '',
        btnAr: 'تسوق',
        btnEn: 'Shop',
        heroImage: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
        productThumb: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=140',
    },
];

const CategoryHighlightCards = ({ mainBrands }: CategoryHighlightCardsProps) => {
    const { language } = useLanguage();

    if (!mainBrands || mainBrands.length === 0) {
        return null;
    }

    const localizedNames: Record<string, { en: string; ar: string }> = {
        'ruby-beauty': { en: 'Ruby Beauty', ar: 'روبي بيوتي' },
        'makeup': { en: 'Makeup', ar: 'مكياج' },
        'perfumes': { en: 'Perfumes', ar: 'عطور' },
        'accessories': { en: 'Accessories', ar: 'اكسسوارات' },
        'watches': { en: 'Watches', ar: 'ساعات' },
    };

    // Desired exact order matching user request
    const categoryOrder = ['accessories', 'perfumes', 'ruby-beauty', 'makeup'];

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
                {categoryOrder.map((slug) => {
                    const brand = mainBrands.find(b => b.slug === slug);
                    const card = CARD_DATA.find(c => c.slug === slug);

                    const categoryName = language === 'ar'
                        ? localizedNames[slug]?.ar || brand?.name || slug
                        : localizedNames[slug]?.en || brand?.name || slug;

                    const heroImage = brand?.image || card?.heroImage || 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800';

                    return (
                        <motion.div
                            key={slug}
                            variants={{
                                hidden: { opacity: 0, y: 40 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
                            }}
                            className="flex-none w-[220px] md:flex-1 min-w-0 snap-start"
                        >
                            <Link
                                href={slug === 'ruby-beauty' ? `/brands/${slug}` : `/categories/${slug}`}
                                className="group relative block w-full bg-[#FDFCF8] dark:bg-[#1a1a1a] rounded-[10px] overflow-hidden border border-black/5 dark:border-white/5"
                            >
                                {/* Image Container */}
                                <div className="relative w-full aspect-square overflow-hidden bg-[#F7F5F0] dark:bg-[#222]">
                                    <ResilientImage
                                        src={heroImage}
                                        alt={categoryName}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                                        loading="lazy"
                                    />
                                </div>

                                {/* Text Content */}
                                <div className="p-4 md:p-5 flex items-center justify-between">
                                    <div className="flex flex-col gap-1.5">
                                        <h3 className="text-[15px] md:text-[17px] font-bold text-[rgb(46,46,46)] dark:text-white leading-tight">
                                            {categoryName}
                                        </h3>
                                        <p className="text-[11px] md:text-xs text-gray-500 dark:text-gray-400 font-medium leading-none">
                                            {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
                                        </p>
                                    </div>

                                    {/* Outline Icon */}
                                    <div className="shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-full border-[1.5px] border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-all duration-300 group-hover:border-black group-hover:text-black dark:group-hover:border-white dark:group-hover:text-white">
                                        <svg className={`w-3.5 h-3.5 md:w-4 md:h-4 ${language === 'ar' ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
