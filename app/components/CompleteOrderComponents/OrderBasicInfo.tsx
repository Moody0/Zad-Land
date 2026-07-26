"use client";

import React from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useCurrency } from '@/app/context/CurrencyContext';

interface OrderBasicInfoProps {
    orderId: string;
    totalAmount: number;
}

const OrderBasicInfo = ({ orderId, totalAmount }: OrderBasicInfoProps) => {
    const { t, language } = useLanguage();
    const { formatPrice } = useCurrency();

    return (
        <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:ltr:text-left md:rtl:text-right bg-gray-50/50 dark:bg-zinc-800/40">
            <div className="flex flex-col gap-1 items-center md:items-start">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t('orderComplete.orderNumber')}</span>
                <p className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white truncate"><span dir="ltr">#{orderId.slice(-8).toUpperCase()}</span></p>
            </div>
            <div className="flex flex-col gap-1 items-center md:items-start">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t('cart.total')}</span>
                <p className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white"><span dir="ltr">{formatPrice(Number(totalAmount))}</span></p>
            </div>
            <div className="flex flex-col gap-1 items-center md:items-start">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{language === 'ar' ? 'التوصيل المتوقع' : 'Est. Delivery'}</span>
                <p className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">{language === 'ar' ? '3-5 أيام عمل' : '3-5 business days'}</p>
            </div>
        </div>
    );
};

export default OrderBasicInfo;
