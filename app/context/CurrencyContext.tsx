"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';

type Currency = 'USD' | 'SYP';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    exchangeRate: number;
    formatPrice: (usdPrice: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children, initialExchangeRate }: { children: React.ReactNode, initialExchangeRate: number }) {
    const [currency, setCurrencyState] = useState<Currency>('SYP');
    const [mounted, setMounted] = useState(false);
    const { language } = useLanguage();

    useEffect(() => {
        const savedCurrency = localStorage.getItem('currency') as Currency;
        if (savedCurrency && (savedCurrency === 'USD' || savedCurrency === 'SYP')) {
            setCurrencyState(savedCurrency);
        }
        setMounted(true);
    }, []);

    const setCurrency = (curr: Currency) => {
        setCurrencyState(curr);
        localStorage.setItem('currency', curr);
    };

    const formatPrice = (usdPrice: number) => {
        const symbol = language === 'ar' ? 'ل.س' : 'SYP';
        const locale = language === 'ar' ? 'ar-SY-u-nu-latn' : 'en-US';
        
        if (!mounted) {
            const price = Math.round(usdPrice * initialExchangeRate);
            return language === 'ar' ? `${symbol} ${price.toLocaleString(locale)}` : `${price.toLocaleString(locale)} ${symbol}`;
        }

        if (currency === 'USD') {
            return `$${usdPrice.toFixed(2)}`;
        } else {
            const price = Math.round(usdPrice * initialExchangeRate);
            return language === 'ar' ? `${symbol} ${price.toLocaleString(locale)}` : `${price.toLocaleString(locale)} ${symbol}`;
        }
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRate: initialExchangeRate, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
