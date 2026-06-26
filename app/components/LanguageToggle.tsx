"use client";

import React from 'react';
import { useLanguage } from '@/app/context/LanguageContext';

const LanguageToggle = () => {
    const { language, setLanguage, t } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    return (
        <button
            onClick={toggleLanguage}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 text-[#072835] dark:text-white group relative"
            aria-label={t('language.switchTo')}
            title={language === 'en' ? 'العربية' : 'English'}
        >
            <span className="font-semibold text-sm tracking-tight">
                {language === 'en' ? 'AR' : 'EN'}
            </span>
        </button>
    );
};

export default LanguageToggle;
