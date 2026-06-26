"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';

const EmptyCart = () => {
    const { t } = useLanguage();

    return (
        <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 lg:px-40 py-20 text-center">
            <h1 className="text-3xl font-black mb-6 text-[#072835] dark:text-white tracking-tight">{t('cart.emptyCart')}</h1>
            <div className="flex justify-center">
                <Link href="/products" className="inline-block bg-[#072835] hover:bg-[#051e28] text-white font-bold py-3.5 px-8 rounded-full transition-colors shadow-md shadow-[#072835]/20 active:scale-[0.98]">
                    {t('cart.startShopping')}
                </Link>
            </div>
        </main>
    );
};

export default EmptyCart;
