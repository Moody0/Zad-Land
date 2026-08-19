"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import { MdInfo, MdArrowBack } from 'react-icons/md';

interface ShippingFormProps {
    formData: {
        firstName: string;
        lastName: string;
        phone: string;
        streetAddress: string;
        city: string;
    };
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ShippingForm = ({ formData, handleInputChange }: ShippingFormProps) => {
    const { t, dir } = useLanguage();

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="col-span-1">
                        <label className="block text-xs font-bold mb-2 text-zinc-900 dark:text-white uppercase tracking-wider">
                            {t('checkout.firstName')} *
                        </label>
                        <input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:border-[#072835] dark:focus:border-[#B8860B] focus:ring-1 focus:ring-[#072835] dark:focus:ring-[#B8860B] outline-none transition-all placeholder:text-gray-400"
                            placeholder={dir === 'rtl' ? 'زين' : 'Zein'}
                            type="text"
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-xs font-bold mb-2 text-zinc-900 dark:text-white uppercase tracking-wider">
                            {t('checkout.lastName')} *
                        </label>
                        <input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:border-[#072835] dark:focus:border-[#B8860B] focus:ring-1 focus:ring-[#072835] dark:focus:ring-[#B8860B] outline-none transition-all placeholder:text-gray-400"
                            placeholder={dir === 'rtl' ? 'أحمد' : 'Ahmad'}
                            type="text"
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-xs font-bold mb-2 text-zinc-900 dark:text-white uppercase tracking-wider">
                            {t('checkout.phoneNumber')} *
                        </label>
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className={`w-full bg-gray-50 dark:bg-zinc-800/60 border rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white outline-none transition-all placeholder:text-gray-400 ${
                                formData.phone && !/^09\d{8}$/.test(formData.phone)
                                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                    : 'border-gray-200 dark:border-white/10 focus:border-[#072835] dark:focus:border-[#B8860B] focus:ring-1 focus:ring-[#072835] dark:focus:ring-[#B8860B]'
                            }`}
                            placeholder="09xxxxxxxx"
                            type="tel"
                            dir="ltr"
                        />
                        <p className={`text-xs font-medium mt-1.5 ${
                            formData.phone && !/^09\d{8}$/.test(formData.phone)
                                ? 'text-red-500 font-bold'
                                : 'text-gray-400'
                        }`}>
                            {dir === 'rtl' ? 'يجب أن يبدأ بـ 09 ويتكون من 10 أرقام' : 'Must start with 09 and be 10 digits'}
                        </p>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-xs font-bold mb-2 text-zinc-900 dark:text-white uppercase tracking-wider">
                            {t('checkout.streetAddress')} *
                        </label>
                        <input
                            name="streetAddress"
                            value={formData.streetAddress}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:border-[#072835] dark:focus:border-[#B8860B] focus:ring-1 focus:ring-[#072835] dark:focus:ring-[#B8860B] outline-none transition-all placeholder:text-gray-400"
                            placeholder={dir === 'rtl' ? 'مثال: طريق المزة السريع، بالقرب من ملعب الجلاء' : 'e.g. Mazzeh Highway, near Al Jalaa Stadium'}
                            type="text"
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-xs font-bold mb-2 text-zinc-900 dark:text-white uppercase tracking-wider">
                            {t('checkout.city')} *
                        </label>
                        <select
                            name="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange(e as any)}
                            required
                            className="w-full bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:border-[#072835] dark:focus:border-[#B8860B] focus:ring-1 focus:ring-[#072835] dark:focus:ring-[#B8860B] outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option value="" className="bg-white dark:bg-zinc-900">{dir === 'rtl' ? 'اختر المدينة' : 'Select City'}</option>
                            <option value="Damascus" className="bg-white dark:bg-zinc-900">{dir === 'rtl' ? 'دمشق' : 'Damascus'}</option>
                            <option value="Aleppo" className="bg-white dark:bg-zinc-900">{dir === 'rtl' ? 'حلب' : 'Aleppo'}</option>
                            <option value="Homs" className="bg-white dark:bg-zinc-900">{dir === 'rtl' ? 'حمص' : 'Homs'}</option>
                            <option value="Hama" className="bg-white dark:bg-zinc-900">{dir === 'rtl' ? 'حماة' : 'Hama'}</option>
                            <option value="Latakia" className="bg-white dark:bg-zinc-900">{dir === 'rtl' ? 'اللاذقية' : 'Latakia'}</option>
                            <option value="Tartus" className="bg-white dark:bg-zinc-900">{dir === 'rtl' ? 'طرطوس' : 'Tartus'}</option>
                            <option value="Idlib" className="bg-white dark:bg-zinc-900">{dir === 'rtl' ? 'إدلب' : 'Idlib'}</option>
                            <option value="Deir ez-Zor" className="bg-white dark:bg-zinc-900">{dir === 'rtl' ? 'دير الزور' : 'Deir ez-Zor'}</option>
                            <option value="Raqqa" className="bg-white dark:bg-zinc-900">{dir === 'rtl' ? 'الرقة' : 'Raqqa'}</option>
                            <option value="Al-Hasakah" className="bg-white dark:bg-zinc-900">{dir === 'rtl' ? 'الحسكة' : 'Al-Hasakah'}</option>
                            <option value="Daraa" className="bg-white dark:bg-zinc-900">{dir === 'rtl' ? 'درعا' : 'Daraa'}</option>
                            <option value="As-Suwayda" className="bg-white dark:bg-zinc-900">{dir === 'rtl' ? 'السويداء' : 'As-Suwayda'}</option>
                            <option value="Quneitra" className="bg-white dark:bg-zinc-900">{dir === 'rtl' ? 'القنيطرة' : 'Quneitra'}</option>
                            <option value="Rif Dimashq" className="bg-white dark:bg-zinc-900">{dir === 'rtl' ? 'ريف دمشق' : 'Rif Dimashq'}</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6 pt-5 border-t border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-3 p-3.5 bg-gray-50 dark:bg-zinc-800/60 rounded-xl border border-gray-200 dark:border-white/10">
                        <MdInfo className="text-[#072835] dark:text-[#B8860B] text-lg shrink-0" />
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-300">{t('checkout.deliveryInfo')}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-2 px-1">
                <Link className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-500 hover:text-[#072835] dark:hover:text-[#B8860B] transition-colors" href="/cart">
                    <MdArrowBack className={`text-sm ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    {t('common.returnToCart')}
                </Link>
            </div>
        </div>
    );
};

export default ShippingForm;
