"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import { MdChevronRight } from 'react-icons/md';

const CheckoutSteps = () => {
    const { t, dir, language } = useLanguage();

    return (
        <div className="flex flex-col gap-2 pb-6">
            <nav className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                <Link href="/cart" className="text-gray-500 transition-colors hover-underline-animated">{t('common.cart')}</Link>
                <MdChevronRight className={`text-[14px] ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                <span className="text-[#072835] dark:text-white">{t('checkout.shippingInformation')}</span>
                <MdChevronRight className={`text-[14px] ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                <span className="opacity-50">{t('checkout.paymentMethod')}</span>
            </nav>
            <h1 className="text-3xl font-black tracking-tight text-[#072835] dark:text-white">{t('checkout.shippingInformation')}</h1>
            <p className="text-[14px] font-medium text-gray-500 dark:text-gray-400">{language === 'ar' ? 'يرجى إدخال معلومات التوصيل أدناه' : 'Please enter your delivery information below'}</p>
        </div>
    );
};

export default CheckoutSteps;
