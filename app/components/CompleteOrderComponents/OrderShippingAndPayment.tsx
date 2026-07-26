"use client";

import React from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { MdLocalShipping, MdPayments } from 'react-icons/md';

interface OrderShippingAndPaymentProps {
    name: string;
    streetAddress: string;
    city: string;
    phone: string;
}

const OrderShippingAndPayment = ({ name, streetAddress, city, phone }: OrderShippingAndPaymentProps) => {
    const { t, language } = useLanguage();

    return (
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:ltr:text-left md:rtl:text-right">
            <div className="flex flex-col gap-3 items-center md:items-start">
                <h3 className="text-sm font-extrabold flex items-center gap-2 text-zinc-900 dark:text-white">
                    <MdLocalShipping className="text-zinc-900 dark:text-white text-lg" />
                    {t('orderComplete.shippingAddress')}
                </h3>
                <div className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed w-full space-y-0.5">
                    <p className="font-bold text-zinc-900 dark:text-white">{name}</p>
                    <p>{streetAddress}</p>
                    <p>{city}</p>
                    <p><span dir="ltr">{phone}</span></p>
                </div>
            </div>
            <div className="flex flex-col gap-3 items-center md:items-start">
                <h3 className="text-sm font-extrabold flex items-center gap-2 text-zinc-900 dark:text-white">
                    <MdPayments className="text-zinc-900 dark:text-white text-lg" />
                    {t('checkout.paymentMethod')}
                </h3>
                <div className="flex flex-col gap-0.5 w-full">
                    <p className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">{t('checkout.cashOnDelivery')}</p>
                    <p className="text-xs text-gray-400">{language === 'ar' ? 'الدفع عند الاستلام' : 'Pay at the time of delivery'}</p>
                </div>
            </div>
        </div>
    );
};

export default OrderShippingAndPayment;
