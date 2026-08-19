'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const CountdownOffer = () => {
    const { dir, language } = useLanguage();
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 17, hours: 0, minutes: 6, seconds: 46 });

    // Target date: 30 days from now for demo, or a fixed date
    useEffect(() => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 17); // 17 days for matching the provided HTML

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatNumber = (num: number) => num.toString().padStart(2, '0');

    return (
        <section className="w-full bg-white dark:bg-[#121212]">
            <div className="container-custom">
                <div className={`w-full rounded-[14px] bg-gradient-to-r from-[#072835] via-[#0a3547] to-[#072835] text-white border border-[#B8860B]/30 h-auto md:h-[155px] py-6 md:py-0 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 ${dir === 'rtl' ? 'md:flex-row' : 'md:flex-row-reverse'}`}>

                    {/* 1. Button */}
                    <div className="flex-shrink-0 order-4 md:order-1">
                        <Link
                            href="/products"
                            className="px-7 py-3 bg-[#B8860B] hover:bg-[#9E7309] text-white rounded-full font-bold text-sm md:text-base transition-all active:scale-95 whitespace-nowrap"
                        >
                            {language === 'ar' ? 'تصفح كافة العروض' : 'All Offers'}
                        </Link>
                    </div>

                    {/* 2. Timer (Middle) */}
                    <div className="flex items-center gap-2.5 md:gap-3 text-[20px] md:text-[26px] font-extrabold text-[#F5F0E0] tabular-nums order-2">
                        <div className="flex flex-col items-center bg-black/25 backdrop-blur-sm border border-[#B8860B]/20 px-3.5 py-1.5 rounded-xl min-w-[56px]">
                            <span className="text-[#E5B54A]">{formatNumber(timeLeft.days)}</span>
                            <span className="text-[9px] uppercase tracking-wider text-white/70 mt-0.5">{language === 'ar' ? 'يوم' : 'Day'}</span>
                        </div>
                        <span className="text-[#B8860B] font-bold">:</span>
                        <div className="flex flex-col items-center bg-black/25 backdrop-blur-sm border border-[#B8860B]/20 px-3.5 py-1.5 rounded-xl min-w-[56px]">
                            <span className="text-[#E5B54A]">{formatNumber(timeLeft.hours)}</span>
                            <span className="text-[9px] uppercase tracking-wider text-white/70 mt-0.5">{language === 'ar' ? 'ساعة' : 'Hrs'}</span>
                        </div>
                        <span className="text-[#B8860B] font-bold">:</span>
                        <div className="flex flex-col items-center bg-black/25 backdrop-blur-sm border border-[#B8860B]/20 px-3.5 py-1.5 rounded-xl min-w-[56px]">
                            <span className="text-[#E5B54A]">{formatNumber(timeLeft.minutes)}</span>
                            <span className="text-[9px] uppercase tracking-wider text-white/70 mt-0.5">{language === 'ar' ? 'دقيقة' : 'Min'}</span>
                        </div>
                        <span className="text-[#B8860B] font-bold">:</span>
                        <div className="flex flex-col items-center bg-black/25 backdrop-blur-sm border border-[#B8860B]/20 px-3.5 py-1.5 rounded-xl min-w-[56px]">
                            <span className="text-[#E5B54A]">{formatNumber(timeLeft.seconds)}</span>
                            <span className="text-[9px] uppercase tracking-wider text-white/70 mt-0.5">{language === 'ar' ? 'ثانية' : 'Sec'}</span>
                        </div>
                    </div>

                    {/* 3. Heading & Subheading */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-start order-1 md:order-3">
                        <span className="text-xs uppercase tracking-widest text-[#E5B54A] font-bold mb-1 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#2E7D32] inline-block animate-pulse"></span>
                            <span>{language === 'ar' ? 'عروض الجملة الحصرية' : 'Exclusive Wholesale Deals'}</span>
                        </span>
                        <h2 className="text-lg md:text-2xl font-bold text-white leading-tight">
                            {language === 'ar' ? 'أفضل العروض والأسعار التنافسية' : 'Best Offers, All in One Place'}
                        </h2>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CountdownOffer;
