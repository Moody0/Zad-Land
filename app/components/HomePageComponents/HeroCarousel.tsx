'use client';

import React from 'react';
import Link from 'next/link';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { useLanguage } from '@/app/context/LanguageContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
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
    buttonTextAr?: string | null;
    link: string | null;
    badge: string | null;
    badgeAr?: string | null;
    isActive: boolean;
}

interface HeroCarouselProps {
    banners: Banner[];
}

const HeroCarousel = ({ banners }: HeroCarouselProps) => {
    const { dir, language } = useLanguage();
    const isArabic = dir === 'rtl';
    const wrapperRef = React.useRef<HTMLElement>(null);
    
    const DEFAULT_BANNER: Banner = {
        id: 'default',
        title: 'Connecting Global Brands to Every Market',
        subtitle: 'Zad Land leading wholesale distribution\nOfficial partner for global products in Syria - Homs',
        titleAr: 'نصل بالعلامات العالمية إلى كل سوق',
        subtitleAr: 'زاد لاند شركة توزيع رائدة\nالوكيل الرسمي لمنتجات عالمية\nوطنية في سوريا - حمص',
        image: "/images/redesign/hero-bg.png",
        buttonText: 'Discover More',
        buttonTextAr: 'اكتشف المزيد',
        link: "/products",
        badge: 'Certified Wholesale',
        badgeAr: 'توزيع جملة معتمد',
        isActive: true
    };

    const getBannerTitle = (banner: Banner): string => {
        return isArabic ? (banner.titleAr || banner.title || 'نصل بالعلامات العالمية إلى كل سوق') : (banner.title || banner.titleAr || 'Connecting Global Brands to Every Market');
    };

    const getBannerSubtitle = (banner: Banner): string => {
        return isArabic ? (banner.subtitleAr || banner.subtitle || 'زاد لاند شركة توزيع رائدة\nالوكيل الرسمي لمنتجات عالمية\nوطنية في سوريا - حمص') : (banner.subtitle || banner.subtitleAr || '');
    };

    const getBannerButtonText = (banner: Banner): string => {
        if (isArabic) {
            return banner.buttonTextAr || banner.buttonText || 'اكتشف المزيد';
        }
        return banner.buttonText || banner.buttonTextAr || 'Discover More';
    };

    const getBannerBadge = (banner: Banner): string => {
        if (isArabic) {
            return banner.badgeAr || banner.badge || 'توزيع جملة معتمد';
        }
        return banner.badge || banner.badgeAr || 'Certified Wholesale';
    };

    const sortedBanners = React.useMemo(() => {
        if (!banners || banners.length === 0) return [DEFAULT_BANNER];
        const hero = banners.find(b => b.image === '/images/redesign/hero-bg.png');
        if (hero) {
            return [hero, ...banners.filter(b => b.id !== hero.id)];
        }
        return banners;
    }, [banners]);

    const displayBanners = sortedBanners;

    return (
        <section ref={wrapperRef} className="w-full pt-0 md:pt-6 pb-0 md:pb-6 group hero-carousel">
            {/* Mobile View (< md): High-Definition Swiper Hero with Dynamic Content */}
            <div className="block md:hidden w-full relative aspect-[390/345] sm:aspect-[420/350] overflow-hidden">
                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={displayBanners.length > 1}
                    speed={800}
                    autoplay={{
                        delay: 6000,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        el: '.mobile-hero-pagination',
                        clickable: true,
                    }}
                    className="h-full w-full"
                >
                    {displayBanners.map((banner, index) => {
                        const isHeroBg = banner.image === '/images/redesign/hero-bg.png';
                        return (
                            <SwiperSlide key={`mob-${banner.id}`} className="h-full w-full relative">
                                {/* Slide Image */}
                                <Image
                                    src={banner.image}
                                    alt={getBannerTitle(banner)}
                                    fill
                                    priority={index === 0}
                                    loading={index === 0 ? "eager" : "lazy"}
                                    sizes="100vw"
                                    className={`object-cover ${isHeroBg ? 'object-[72%_center]' : 'object-center'}`}
                                />

                                {/* Gradient Scrim for Contrast - Reduced width localized strictly behind text */}
                                <div
                                    className={`absolute inset-y-0 pointer-events-none transition-all duration-300 ${
                                        isArabic
                                            ? 'right-0 w-[55%] sm:w-[50%] max-w-[280px] bg-gradient-to-l from-black/75 via-black/35 to-transparent'
                                            : 'left-0 w-[55%] sm:w-[50%] max-w-[280px] bg-gradient-to-r from-black/75 via-black/35 to-transparent'
                                    }`}
                                />

                                {/* Text & CTA Overlay - Middle Right in AR mode, Middle Left in EN mode */}
                                <div
                                    dir={isArabic ? 'rtl' : 'ltr'}
                                    className={`absolute top-1/2 -translate-y-1/2 z-10 w-[70%] sm:w-[64%] max-w-[280px] sm:max-w-[320px] flex flex-col ${
                                        isArabic
                                            ? 'right-4 sm:right-6 items-start text-right'
                                            : 'left-4 sm:left-6 items-start text-left'
                                    }`}
                                >
                                    {/* Show Wholesale Badge only on non-hero-bg slides */}
                                    {!isHeroBg && (
                                        <div className="mb-2.5">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] sm:text-xs font-black tracking-wider bg-[#B8860B] text-white shadow-xs">
                                                {getBannerBadge(banner)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Main Headline */}
                                    {isHeroBg ? (
                                        <h1 className="text-[27px] sm:text-[32px] font-black text-white leading-[1.12] tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                                            {isArabic ? (
                                                <>
                                                    <span className="block">نصل بالعلامات</span>
                                                    <span className="block">العالمية</span>
                                                    <span className="block text-[#E5B54A]">إلى كل سوق</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="block">Connecting Global</span>
                                                    <span className="block">Brands to</span>
                                                    <span className="block text-[#E5B54A]">Every Market</span>
                                                </>
                                            )}
                                        </h1>
                                    ) : (
                                        <h1 className="text-[24px] sm:text-[28px] font-black text-white leading-[1.14] tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] line-clamp-2">
                                            {getBannerTitle(banner)}
                                        </h1>
                                    )}

                                    {/* Subtitle */}
                                    <p className="text-[13px] sm:text-[14.5px] text-white/95 font-semibold leading-[1.38] mt-2.5 sm:mt-3 drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)] max-w-[260px] sm:max-w-[300px] line-clamp-3">
                                        {getBannerSubtitle(banner)}
                                    </p>

                                    {/* CTA Button */}
                                    <Link
                                        href={banner.link || "/products"}
                                        className="inline-flex items-center gap-2.5 mt-3.5 sm:mt-4 px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#C59B27] via-[#B8860B] to-[#9E7309] hover:brightness-110 text-white text-[13.5px] sm:text-[15px] font-black shadow-[0_5px_15px_rgba(0,0,0,0.45)] transition-all active:scale-95 border border-white/30 group/btn"
                                    >
                                        <span>{getBannerButtonText(banner)}</span>
                                        <span className="text-base sm:text-lg font-black leading-none transition-transform duration-200 group-hover/btn:translate-x-0.5 rtl:group-hover/btn:-translate-x-0.5">
                                            {isArabic ? '‹' : '›'}
                                        </span>
                                    </Link>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>

                {/* Mobile Pagination Dots */}
                {displayBanners.length > 1 && (
                    <div className="mobile-hero-pagination absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none" />
                )}
            </div>

            {/* Desktop View (>= md): Interactive Swiper Hero */}
            <div className="hidden md:block container-custom">
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#FAF6EC] dark:bg-[#1a1a1a] h-[400px] lg:h-[480px] shadow-xs">
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
                                <div className="flex flex-col md:flex-row rtl:md:flex-row-reverse h-full w-full relative">
                                    
                                    {/* Image Container - Left side on desktop */}
                                    <div className="w-full h-full md:w-1/2 relative shrink-0 block overflow-hidden">
                                        <Image
                                            src={banner.image}
                                            alt={getBannerTitle(banner)}
                                            fill
                                            priority={index === 0}
                                            loading={index === 0 ? "eager" : "lazy"}
                                            fetchPriority={index === 0 ? "high" : "low"}
                                            sizes="50vw"
                                            className="object-cover object-center transition-transform duration-700 md:group-hover:scale-105"
                                        />
                                    </div>

                                    {/* Desktop Content Container - Hidden on mobile, Right side on desktop */}
                                    <div className="relative z-10 hidden md:flex w-full md:h-full md:w-1/2 flex-col items-center justify-center text-center md:px-10 lg:px-16 bg-[#FAF6EC] dark:bg-[#1A1A14]">
                                        <div className="animate-fadeInUp w-full max-w-[360px] md:max-w-lg flex flex-col items-center text-center">
                                            
                                            {/* Badge */}
                                            <div className="mb-3">
                                                <span className="bg-amber-100/80 text-[#B8860B] dark:bg-amber-950/40 dark:text-[#E5B54A] px-4 py-1 rounded-full text-xs font-bold tracking-wider">
                                                    {getBannerBadge(banner)}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h2 className="text-[30px] md:text-[36px] lg:text-[44px] font-black leading-[1.18] mb-3 md:mb-4 text-[#072835] dark:text-[#F5F0E0]">
                                                {getBannerTitle(banner)}
                                            </h2>
                                            
                                            {/* Description */}
                                            <p className="text-[14px] md:text-[15.5px] lg:text-[16.5px] text-[#5A5A48] dark:text-[#C4B89A] mb-5 md:mb-7 leading-relaxed font-medium line-clamp-2">
                                                {getBannerSubtitle(banner)}
                                            </p>
                                            
                                            {/* Button */}
                                            <Link
                                                href={banner.link || "/products"}
                                                className="px-8 py-3 bg-[#B8860B] hover:bg-[#9E7309] text-white rounded-full font-extrabold text-base transition-all flex items-center justify-center gap-2 w-fit group/btn active:scale-95 shadow-md"
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
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:bottom-5 md:right-6 z-20 flex items-center pointer-events-none">
                        
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
                    width: 6px;
                    height: 6px;
                    background: rgba(184, 134, 11, 0.4);
                    opacity: 1;
                    transition: all 0.3s;
                    border-radius: 99px;
                    margin: 0 3px !important;
                }
                .hero-carousel .swiper-pagination-bullet-active {
                    width: 36px;
                    background: rgba(184, 134, 11, 0.25) !important;
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
                    background: #B8860B;
                    border-radius: 99px;
                }
                [dir="rtl"] .hero-carousel .swiper-pagination-bullet-active::after {
                    left: auto;
                    right: 0;
                }
                .hero-carousel .mobile-hero-pagination .swiper-pagination-bullet {
                    width: 6px;
                    height: 6px;
                    background: rgba(255, 255, 255, 0.55);
                    opacity: 1;
                    transition: all 0.3s;
                    border-radius: 99px;
                    margin: 0 3px !important;
                }
                .hero-carousel .mobile-hero-pagination .swiper-pagination-bullet-active {
                    width: 20px;
                    background: #B8860B !important;
                    border-radius: 99px;
                }
            `}</style>
        </section>
    );
};

export default HeroCarousel;
