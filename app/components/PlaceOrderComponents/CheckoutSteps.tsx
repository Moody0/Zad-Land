"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';

const CheckoutSteps = () => {
    const { t, language } = useLanguage();

    return (
        <div className="flex flex-col gap-2 pb-6">
            <nav className="flex items-center flex-wrap gap-y-2 text-[11px] md:text-[12px] font-bold text-[#072835]/50 dark:text-white/40 uppercase tracking-[0.1em] mb-4" aria-label="Breadcrumb">
                <Link href="/" className="text-[#072835] dark:text-white/70 hover:text-[#B8860B] dark:hover:text-[#B8860B] transition-colors">
                    {language === 'ar' ? 'الرئيسية' : 'Home'}
                </Link>
                <span className="mx-2 md:mx-4 text-gray-300 dark:text-white/20">|</span>
                <Link href="/cart" className="text-[#072835] dark:text-white/70 hover:text-[#B8860B] dark:hover:text-[#B8860B] transition-colors">
                    {t('common.cart')}
                </Link>
                <span className="mx-2 md:mx-4 text-gray-300 dark:text-white/20">|</span>
                <span className="text-[#B8860B] font-extrabold">
                    {t('checkout.shippingInformation')}
                </span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#072835] dark:text-white">
                {t('checkout.shippingInformation')}
            </h1>
            <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">
                {language === 'ar' ? 'يرجى إدخال معلومات التوصيل أدناه' : 'Please enter your delivery information below'}
            </p>
        </div>
    );
};

export default CheckoutSteps;
