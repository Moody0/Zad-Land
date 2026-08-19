"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import { MdShoppingBag } from 'react-icons/md';

const OrderSupportFooter = () => {
    const { t } = useLanguage();

    return (
        <>
            <div className="w-full mt-8">
                <Link
                    href="/products"
                    className="w-full bg-[#072835] hover:bg-[#0c4054] text-white font-bold rounded-xl h-12 flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm"
                >
                    <span>{t('cart.continueShopping')}</span>
                    <MdShoppingBag className="text-base text-[#B8860B]" />
                </Link>
            </div>
            <div className="mt-8 flex flex-col items-center gap-2 text-center">
                <p className="text-xs text-gray-500">
                    {t('checkout.needAssistance')}{' '}
                    <a
                        className="text-[#072835] dark:text-[#B8860B] font-bold hover:underline"
                        href="https://wa.me/963933254796"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t('footer.contactUs')}
                    </a>
                </p>
            </div>
        </>
    );
};

export default OrderSupportFooter;
