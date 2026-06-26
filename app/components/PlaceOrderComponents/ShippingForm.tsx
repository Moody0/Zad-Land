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
        <div className="flex flex-col gap-8">
            <div className="bg-white dark:bg-white/5 p-8 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#E6E9EB] dark:border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1">
                        <label className="block text-[13px] font-bold mb-2 text-[#072835] dark:text-white uppercase tracking-wider">{t('checkout.firstName')} *</label>
                        <input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-[#FAFAFA] dark:bg-white/5 border border-[#E6E9EB] dark:border-white/10 rounded-xl px-4 py-3.5 focus:border-[#072835] focus:ring-1 focus:ring-[#072835] outline-none transition-all shadow-sm text-[15px]"
                            placeholder={dir === 'rtl' ? 'زين' : 'Zein'}
                            type="text"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-[13px] font-bold mb-2 text-[#072835] dark:text-white uppercase tracking-wider">{t('checkout.lastName')} *</label>
                        <input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-[#FAFAFA] dark:bg-white/5 border border-[#E6E9EB] dark:border-white/10 rounded-xl px-4 py-3.5 focus:border-[#072835] focus:ring-1 focus:ring-[#072835] outline-none transition-all shadow-sm text-[15px]"
                            placeholder={dir === 'rtl' ? 'أحمد' : 'Ahmad'}
                            type="text"
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-[13px] font-bold mb-2 text-[#072835] dark:text-white uppercase tracking-wider">{t('checkout.phoneNumber')} *</label>
                        <div className="relative">
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                className={`w-full bg-[#FAFAFA] dark:bg-white/5 border rounded-xl px-4 py-3.5 outline-none transition-all shadow-sm text-[15px] ${
                                    formData.phone && !/^09\d{8}$/.test(formData.phone)
                                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                        : 'border-[#E6E9EB] dark:border-white/10 focus:border-[#072835] focus:ring-1 focus:ring-[#072835]'
                                }`}
                                placeholder="09xxxxxxxx"
                                type="tel"
                                dir="ltr"
                            />
                        </div>
                        <p className={`text-[11px] font-medium mt-1.5 ${
                            formData.phone && !/^09\d{8}$/.test(formData.phone)
                                ? 'text-red-500'
                                : 'text-gray-400'
                        }`}>
                            {dir === 'rtl' ? 'يجب أن يبدأ بـ 09 ويتكون من 10 أرقام' : 'Must start with 09 and be 10 digits'}
                        </p>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-[13px] font-bold mb-2 text-[#072835] dark:text-white uppercase tracking-wider">{t('checkout.streetAddress')} *</label>
                        <input
                            name="streetAddress"
                            value={formData.streetAddress}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-[#FAFAFA] dark:bg-white/5 border border-[#E6E9EB] dark:border-white/10 rounded-xl px-4 py-3.5 focus:border-[#072835] focus:ring-1 focus:ring-[#072835] outline-none transition-all shadow-sm text-[15px]"
                            placeholder={dir === 'rtl' ? 'مثال: طريق المزة السريع، بالقرب من ملعب الجلاء' : 'e.g. Mazzeh Highway, near Al Jalaa Stadium'}
                            type="text"
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-[13px] font-bold mb-2 text-[#072835] dark:text-white uppercase tracking-wider">{t('checkout.city')} *</label>
                        <select
                            name="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange(e as any)}
                            required
                            className="w-full bg-[#FAFAFA] dark:bg-white/5 border border-[#E6E9EB] dark:border-white/10 rounded-xl px-4 py-3.5 focus:border-[#072835] focus:ring-1 focus:ring-[#072835] outline-none transition-all shadow-sm appearance-none cursor-pointer text-[15px]"
                        >
                            <option value="">{dir === 'rtl' ? 'اختر المدينة' : 'Select City'}</option>
                            <option value="Damascus">{dir === 'rtl' ? 'دمشق' : 'Damascus'}</option>
                            <option value="Aleppo">{dir === 'rtl' ? 'حلب' : 'Aleppo'}</option>
                            <option value="Homs">{dir === 'rtl' ? 'حمص' : 'Homs'}</option>
                            <option value="Hama">{dir === 'rtl' ? 'حماة' : 'Hama'}</option>
                            <option value="Latakia">{dir === 'rtl' ? 'اللاذقية' : 'Latakia'}</option>
                            <option value="Tartus">{dir === 'rtl' ? 'طرطوس' : 'Tartus'}</option>
                            <option value="Idlib">{dir === 'rtl' ? 'إدلب' : 'Idlib'}</option>
                            <option value="Deir ez-Zor">{dir === 'rtl' ? 'دير الزور' : 'Deir ez-Zor'}</option>
                            <option value="Raqqa">{dir === 'rtl' ? 'الرقة' : 'Raqqa'}</option>
                            <option value="Al-Hasakah">{dir === 'rtl' ? 'الحسكة' : 'Al-Hasakah'}</option>
                            <option value="Daraa">{dir === 'rtl' ? 'درعا' : 'Daraa'}</option>
                            <option value="As-Suwayda">{dir === 'rtl' ? 'السويداء' : 'As-Suwayda'}</option>
                            <option value="Quneitra">{dir === 'rtl' ? 'القنيطرة' : 'Quneitra'}</option>
                            <option value="Rif Dimashq">{dir === 'rtl' ? 'ريف دمشق' : 'Rif Dimashq'}</option>
                        </select>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-[#E6E9EB] dark:border-white/10">
                    <div className="flex items-center gap-3 p-4 bg-[#FAFAFA] dark:bg-white/5 rounded-xl border border-[#E6E9EB] dark:border-white/10">
                        <MdInfo className="text-[#072835] dark:text-white text-xl shrink-0" />
                        <p className="text-[13px] font-medium text-gray-500 dark:text-gray-300">{t('checkout.deliveryInfo')}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-4 pl-2">
                <Link className="flex items-center gap-2 text-[14px] font-bold text-gray-500 hover-underline-animated transition-colors border-b border-transparent hover:border-[#072835]" href="/cart">
                    <MdArrowBack className={`text-sm ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    {t('common.returnToCart')}
                </Link>
            </div>
        </div>
    );
};

export default ShippingForm;

