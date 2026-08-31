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
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 text-zinc-900 dark:text-white group relative"
            aria-label={language === 'en' ? 'AR - Switch to Arabic' : 'EN - Switch to English'}
            title={language === 'en' ? 'العربية' : 'English'}
        >
            <span className="font-semibold text-xs tracking-tight">
                {language === 'en' ? 'AR' : 'EN'}
            </span>
        </button>
    );
};

export default LanguageToggle;
