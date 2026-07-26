'use client';

import React from 'react';
import Link from 'next/link';
import { MdArrowForward, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { useLanguage } from '@/app/context/LanguageContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { getSafeImageUrl } from '@/lib/image-utils';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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

interface HeroCarouselProps {
    banners: Banner[];
}

const HeroCarousel = ({ banners }: HeroCarouselProps) => {
    const { t, dir, language } = useLanguage();
    const wrapperRef = React.useRef<HTMLElement>(null);
    
    const DEFAULT_BANNER: Banner = {
        id: 'default',
        title: 'Flash Sale 50% Off',
        subtitle: 'Pamper yourself with beauty you love. Enjoy discounts up to 50% for a limited time this week.',
        titleAr: 'خصم حتى ٥٠٪',
        subtitleAr: 'دلعي نفسك بجمال تحبينه. استمتعي بخصومات تصل إلى ٥٠٪ لفترة محدودة هذا الأسبوع',
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8pRgU38opDPgidWmDRVHh18-R0XsEouLP3xdxsGLZz4BX3nQjc-9PXhgFNDVECMvP80S7ZtFmpA-QwwrnKgOR8B7WY0FlM3qJCAf1J8cxpwvyt6V15oxTZz-uhtroLEp-87KWQzsp-6-2mVURrFG_Q6mWjJ5YGqT0gqwmcLOPMK6pDk77rqmdXEvvM82qGkXdLNmSeXBPXY9j9zwnT_PjJ5YAOzWa2PqrFvo1SOjMCtz71ZHQraBSPlt7TKx00ccpwm4TTWoB6b0y",
        buttonText: language === 'ar' ? 'اكتشفي' : 'Discover',
        link: "/products",
        badge: language === 'ar' ? 'عرض الويك اند' : 'Weekend Offer',
        isActive: true
    };

    const getBannerTitle = (banner: Banner): string => {
        return language === 'ar' ? (banner.titleAr || banner.title || '') : (banner.title || banner.titleAr || '');
    };

    const getBannerSubtitle = (banner: Banner): string => {
        return language === 'ar' ? (banner.subtitleAr || banner.subtitle || '') : (banner.subtitle || banner.subtitleAr || '');
    };

    const getBannerButtonText = (banner: Banner): string => {
        if (language === 'ar') {
            if (!banner.buttonText || banner.buttonText === 'Shop Now') {
                return 'اكتشفي';
            }
            return banner.buttonText;
        }
        return banner.buttonText || 'Discover';
    };

    const displayBanners = banners && banners.length > 0 ? banners : [DEFAULT_BANNER];

    return (
        <section ref={wrapperRef} className="container-custom pt-4 md:pt-6 pb-4 md:pb-6 group hero-carousel">
            <div className="w-full relative">
                {/* Responsive Height: Image only on mobile, sleek banner on desktop */}
                <div className="relative overflow-hidden rounded-[10px] bg-[#FAECE8] dark:bg-[#1a1a1a] h-[150px] md:h-[400px] lg:h-[480px]">
                    <Swiper
                        modules={[Autoplay, Navigation, Pagination]}
                        spaceBetween={0}
                        slidesPerView={1}
                        loop={displayBanners.length > 1}
                        speed={1000}
                        autoplay={{
                            delay: 6000,
                            disableOnInteraction: false,
                        }}
                        onAutoplayTimeLeft={(swiper, time, progress) => {
                            if (wrapperRef.current) {
                                wrapperRef.current.style.setProperty('--autoplay-progress', `${(1 - progress) * 100}%`);
                            }
                        }}
                        pagination={{
                            el: '.hero-swiper-pagination',
                            clickable: true,
                            renderBullet: function (index, className) {
                                return '<span class="' + className + '"></span>';
                            },
                        }}
                        navigation={{
                            nextEl: '.swiper-button-next-hero',
                            prevEl: '.swiper-button-prev-hero',
                        }}
                        className="h-full w-full"
                    >
                        {displayBanners.map((banner, index) => (
                            <SwiperSlide key={banner.id} className="h-full w-full">
                                <div className="flex flex-col md:flex-row rtl:md:flex-row-reverse h-full w-full">
                                    
                                    {/* Image Container - Full width/height on mobile, left side on desktop */}
                                    <Link 
                                        href={banner.link || "/products"} 
                                        className="w-full h-full md:w-1/2 relative shrink-0 block group/mobile overflow-hidden active:scale-[0.98] md:active:scale-100 transition-transform duration-300"
                                    >
                                        <Image
                                            src={banner.image}
                                            alt={getBannerTitle(banner)}
                                            fill
                                            priority={index === 0}
                                            sizes="100vw"
                                            className="object-cover object-center transition-transform duration-700 md:group-hover/mobile:scale-105"
                                        />
                                        
                                        {/* Mobile Click Indicator - Hidden on Desktop */}
                                        <div className="absolute bottom-2.5 ltr:right-2.5 rtl:left-2.5 md:hidden z-10 pointer-events-none">
                                            <span className="bg-white/95 backdrop-blur-md text-black text-[10px] font-bold py-1 px-3 rounded-full shadow-lg flex items-center gap-1.5 border border-white/20">
                                                {getBannerButtonText(banner)}
                                                <svg className={`w-2.5 h-2.5 ${dir === 'rtl' ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M7.5 3.75L13.75 10L7.5 16.25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </span>
                                        </div>
                                    </Link>

                                    {/* Content Container - Hidden on mobile, Right side on desktop */}
                                    <div className="relative z-10 hidden md:flex w-full md:h-full md:w-1/2 flex-col items-center justify-center text-center md:px-12 lg:px-20 bg-[#FAECE8] dark:bg-[#1a1a1a]">
                                        <div className="animate-fadeInUp w-full max-w-[320px] md:max-w-md flex flex-col items-center text-center">
                                            

                                            
                                            {/* Title */}
                                            <h2 className="text-[32px] md:text-[38px] lg:text-[44px] font-bold leading-[1.2] mb-3 md:mb-5 text-[#072835] dark:text-[#072835] md:dark:text-white">
                                                {getBannerTitle(banner)}
                                            </h2>
                                            
                                            {/* Description */}
                                            <p className="text-[14px] md:text-base lg:text-[17px] text-[#555] md:text-[#666] md:dark:text-white/70 mb-5 md:mb-8 leading-relaxed font-medium">
                                                {getBannerSubtitle(banner)}
                                            </p>
                                            
                                            {/* Button */}
                                            <Link
                                                href={banner.link || "/products"}
                                                className="px-8 py-3 bg-black text-white hover:bg-white hover:text-black border border-transparent hover:border-black rounded-full font-bold text-[15px] md:text-base transition-all flex items-center justify-center gap-3 w-fit group/btn shadow-lg active:scale-95"
                                            >
                                                <span>{getBannerButtonText(banner)}</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation and Pagination Group - Centered on Mobile, Bottom Right on Desktop */}
                    <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:bottom-6 md:right-6 z-20 flex items-center pointer-events-none">
                        
                        <button className="swiper-button-prev-hero pointer-events-auto hidden md:flex items-center justify-center text-[#4A4A4A] hover:text-black transition-colors mr-2">
                            <svg className="w-4 h-4 rtl:scale-x-[-1]" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.5 16.25L6.25 10L12.5 3.75" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        </button>

                        <div className="hero-swiper-pagination pointer-events-auto flex items-center justify-center" />

                        <button className="swiper-button-next-hero pointer-events-auto hidden md:flex items-center justify-center text-[#4A4A4A] hover:text-black transition-colors ml-2">
                            <svg className="w-4 h-4 rtl:scale-x-[-1]" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.5 3.75L13.75 10L7.5 16.25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .hero-carousel .swiper-pagination-bullet {
                    width: 7px;
                    height: 7px;
                    background: #A89D9F;
                    opacity: 1;
                    transition: all 0.3s;
                    border-radius: 99px;
                    margin: 0 4px !important;
                }
                .hero-carousel .swiper-pagination-bullet-active {
                    width: 48px;
                    background: #D9CDD1 !important;
                    position: relative;
                    overflow: hidden;
                }
                .hero-carousel .swiper-pagination-bullet-active::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    width: var(--autoplay-progress, 0%);
                    background: #333333;
                    border-radius: 99px;
                }
                [dir="rtl"] .hero-carousel .swiper-pagination-bullet-active::after {
                    left: auto;
                    right: 0;
                }
            `}</style>
        </section>
    );
};

export default HeroCarousel;
