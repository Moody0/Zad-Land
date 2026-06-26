"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import { MdArrowForward } from 'react-icons/md';

interface CartSummaryProps {
    subtotal: number;
}

const CartSummary = ({ subtotal }: CartSummaryProps) => {
    const { t, dir } = useLanguage();

    return (
        <div className="sticky top-[168px] space-y-6">
            <div className="bg-white dark:bg-white/5 p-8 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#E6E9EB] dark:border-white/10">
                <h2 className="text-[18px] font-bold mb-6 text-[#072835] dark:text-white uppercase tracking-wider">{t('cart.orderSummary')}</h2>
                <div className="flex flex-col gap-3.5 mb-6 border-b border-[#E6E9EB] dark:border-white/10 pb-6">
                    <div className="flex justify-between text-gray-500 dark:text-gray-400 text-[14px] font-medium">
                        <span>{t('cart.subtotal')}</span>
                        <span className="font-bold text-[#072835] dark:text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 dark:text-gray-400 text-[14px] font-medium">
                        <span>{t('cart.shipping')}</span>
                        <span className="font-bold text-green-600 uppercase tracking-wide text-[12px]">{t('cart.freeShipping')}</span>
                    </div>
                </div>
                <div className="flex justify-between items-end mb-8">
                    <span className="text-[18px] font-bold text-[#072835] dark:text-white uppercase tracking-wider">{t('cart.total')}</span>
                    <span className="text-3xl font-black text-[#C20059] leading-none">${subtotal.toFixed(2)}</span>
                </div>

                <Link href="/place-order" className="w-full bg-[#072835] hover:bg-[#051e28] text-white font-bold rounded-full h-[54px] flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] shadow-lg shadow-[#072835]/20 text-[16px]">
                    <span>{t('cart.proceedToCheckout')}</span>
                    <MdArrowForward className={`text-[18px] ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                </Link>

            </div>
            <div className="bg-[#FAFAFA] dark:bg-white/5 p-5 rounded-[16px] border border-[#E6E9EB] dark:border-white/10 text-center shadow-sm">
                <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400">{t('footer.contactUs')}</p>
                <a 
                    className="text-[14px] font-bold text-[#072835] dark:text-white mt-1 hover-underline-animated" 
                    href="https://wa.me/963933254796"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {t('footer.helpCenter')}
                </a>
            </div>
        </div>
    );
};

export default CartSummary;
