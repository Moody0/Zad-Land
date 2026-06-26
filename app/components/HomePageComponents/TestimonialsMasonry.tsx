'use client';

import React, { useState } from 'react';
import ResilientImage from '@/app/components/ResilientImage';
import { useLanguage } from '@/app/context/LanguageContext';
import Link from 'next/link';

const TESTIMONIALS = [
    {
        id: 1,
        nameAr: 'شام خ.',
        nameEn: 'Sham K.',
        textAr: '"بصراحة هاد الغسول بجنن! لطيف كتير عالبشرة ومابينشفها أبداً. صرت استخدمه كل يوم الصبح والمسى ونتيجتو بتعقد."',
        textEn: '"Honestly this cleanser is amazing! Very gentle on the skin and doesn\'t dry it at all. I use it every morning and night and the results are mind-blowing."',
        productAr: 'الغسول المرطب للوجه',
        productEn: 'Hydrating Face Cleanser',
        image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
        rating: 5,
    },
    {
        id: 2,
        nameAr: 'ياسمين ش.',
        nameEn: 'Yasmine S.',
        textAr: '"عطر ولا أروع.. ريحتو بتجنن وثابتة طول اليوم. كل رفقاتي بالجامعة سألوني شو حاطة. أكيد رح أرجع أطلب منو."',
        textEn: '"A perfume like no other.. its scent is amazing and lasts all day. All my friends asked me what I was wearing. I will definitely order it again."',
        productAr: 'عطر مسك الورد',
        productEn: 'Rose Musk Perfume',
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400',
        rating: 5,
    },
    {
        id: 3,
        nameAr: 'لانا م.',
        nameEn: 'Lana M.',
        textAr: '"الشامبو هاد غيرلي شعري 180 درجة! شعري كان كتير تعبان ومقصف، وهلأ صار بيلمع وحيوي. يسلم دياتكن عهيك منتج."',
        textEn: '"This shampoo changed my hair 180 degrees! My hair was very damaged, and now it\'s shiny and full of life. Thank you for such a product."',
        productAr: 'شامبو العناية الفائقة',
        productEn: 'Premium Care Shampoo',
        image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400',
        rating: 5,
    },
    {
        id: 4,
        nameAr: 'هبة ط.',
        nameEn: 'Hiba T.',
        textAr: '"واقي الشمس رهيب، مابترك أي أثر أبيض وبيمتصه الجلد بسرعة. أحسن واقي جربتو لهلأ لدرجة بستخدمه قبل المكياج."',
        textEn: '"The sunscreen is awesome, leaves no white cast and absorbs quickly. Best sunscreen I\'ve tried so far, I even use it under makeup."',
        productAr: 'جل واقي الشمس',
        productEn: 'Sunscreen Gel',
        image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=400',
        rating: 5,
    },
    {
        id: 5,
        nameAr: 'مايا أ.',
        nameEn: 'Maya A.',
        textAr: '"الساعة اللي طلبتها بتعقد! كتير أنيقة عاللبس وجودتها ممتازة متل الصور بالزبط. التغليف كان مرتب كمان بيصلح هدية."',
        textEn: '"The watch I ordered is amazing! Very elegant and excellent quality exactly like the pictures. The packaging was neat too, great for a gift."',
        productAr: 'ساعة ذهبية أنيقة',
        productEn: 'Elegant Gold Watch',
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
        rating: 5,
    },
    {
        id: 6,
        nameAr: 'سارة ب.',
        nameEn: 'Sarah B.',
        textAr: '"البادي ميست ريحتو بتشرح القلب. خفيف ومنعش للصيف. بنصح الكل يجربو خصوصي بعد الحمام."',
        textEn: '"The body mist scent is so uplifting. Light and refreshing for summer. I highly recommend trying it, especially after a shower."',
        rating: 5,
    },
];

const StarIcons = () => (
    <div className="flex text-[#1a1a1a] gap-1 mb-4 rtl:justify-end ltr:justify-start">
        {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0.5L10.0784 5.63932L15.6085 6.02786L11.3629 9.59268L12.7023 14.9721L8 12.036L3.29772 14.9721L4.63706 9.59268L0.391548 6.02786L5.92159 5.63932L8 0.5Z" />
            </svg>
        ))}
    </div>
);

import { useProductRail } from '@/app/components/HomePageComponents/useProductRail';

interface Product {
    id: string;
    slug: string;
    name: string;
    images: string;
}

const TestimonialsMasonry = ({ products }: { products?: Product[] }) => {
    const { language } = useLanguage();
    const { railRef, progressBarRef } = useProductRail(language === 'ar' ? 'rtl' : 'ltr');

    // Helper to get product image safely
    const getProductImage = (imagesStr: string) => {
        try {
            const parsed = JSON.parse(imagesStr);
            return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : '';
        } catch {
            return imagesStr;
        }
    };
    
    return (
        <section className="w-full bg-white overflow-hidden pb-10 md:pb-16">
            <div className="container-custom">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
                    <h2 className="text-2xl md:text-[32px] font-bold text-[#1a1a1a] leading-tight">
                        {language === 'ar' 
                            ? 'أكثر من ٢۰۰۰ تقييم إيجابي من عملائنا' 
                            : 'Over 2000 positive reviews from our customers'}
                    </h2>
                </div>

                {/* Scroll Wrapper */}
                <div className="relative">
                    <div 
                        ref={railRef}
                        className="-mx-4 overflow-x-auto px-4 scrollbar-hide sm:mx-0 sm:px-0 md:overflow-visible"
                    >
                        {/* On desktop, we use columns. On mobile, we use flex snap-x */}
                        <div className="flex md:block md:columns-2 lg:columns-3 snap-x snap-mandatory gap-4 pb-2 md:gap-6">
                            {TESTIMONIALS.map((testimonial, index) => {
                                // Use a product from the DB if available, else fallback
                                const dbProduct = products && products.length > index ? products[index] : null;
                                const productUrl = dbProduct ? `/products/${dbProduct.slug}` : '/products';
                                const productImg = dbProduct ? getProductImage(dbProduct.images) : 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400';
                                const productName = dbProduct ? dbProduct.name : (language === 'ar' ? 'عطر مسك الورد' : 'Rose Musk Perfume');

                                return (
                                    <div 
                                        key={testimonial.id} 
                                        className="w-[300px] shrink-0 snap-start md:w-auto break-inside-avoid mb-0 md:mb-6 bg-[#f9f9f9] rounded-[10px] p-5 md:p-6 flex flex-col h-fit text-right"
                                        style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
                                    >
                                        <div className="flex flex-col mb-4">
                                            <h3 className="font-bold text-[#1a1a1a] text-base md:text-lg">
                                                {language === 'ar' ? testimonial.nameAr : testimonial.nameEn}
                                            </h3>
                                            <span className="text-xs text-gray-500 mt-1">
                                                {language === 'ar' ? 'Verified Buyer' : 'Verified Buyer'}
                                            </span>
                                        </div>

                                        {index === 0 && <StarIcons />}

                                        <p className="text-[#4a4a4a] text-sm md:text-base leading-relaxed mb-6">
                                            {language === 'ar' ? testimonial.textAr : testimonial.textEn}
                                        </p>

                                        <Link href={productUrl} className="mt-auto pt-4 border-t border-gray-200 group flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-[8px] overflow-hidden bg-white shrink-0 shadow-sm border border-gray-100">
                                                <ResilientImage
                                                    src={productImg}
                                                    alt={productName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <span className="text-sm font-bold text-[#1a1a1a] line-clamp-2 text-right flex-1">
                                                <span className="inline group-hover-underline-animated">
                                                    {productName}
                                                </span>
                                            </span>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Mobile Progress Bar */}
                <div className="mt-8 flex items-center gap-4 px-2 w-full md:hidden">
                    <div className="flex-1 h-[2px] bg-gray-200 relative overflow-hidden rounded-full">
                        <div 
                            ref={progressBarRef}
                            className="absolute top-0 bottom-0 bg-[#000000] rounded-full" 
                            style={{ 
                                width: '100%', 
                                transformOrigin: language === 'ar' ? 'right center' : 'left center', 
                                transform: `scaleX(0)`, 
                                willChange: 'transform' 
                            }} 
                        />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default TestimonialsMasonry;
