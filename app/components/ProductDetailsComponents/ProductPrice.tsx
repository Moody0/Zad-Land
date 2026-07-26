"use client";

import React from "react";
import { useCurrency } from "@/app/context/CurrencyContext";
import { useLanguage } from "@/app/context/LanguageContext";

interface ProductPriceProps {
    price: string;
    discountPrice?: string | null;
}

const ProductPrice = ({ price, discountPrice }: ProductPriceProps) => {
    const { formatPrice } = useCurrency();
    const { language } = useLanguage();

    const hasDiscount = discountPrice && Number(discountPrice) < Number(price);
    const discountPercentage = hasDiscount ? Math.round((1 - Number(discountPrice) / Number(price)) * 100) : 0;

    return (
        <div className="flex flex-wrap items-center gap-3 mb-3">
            <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white leading-none" dir="ltr">
                    {formatPrice(Number(hasDiscount ? discountPrice : price))}
                </span>
                {hasDiscount && (
                    <s className="text-lg text-gray-400 font-medium leading-none" dir="ltr">
                        {formatPrice(Number(price))}
                    </s>
                )}
            </div>

            {hasDiscount && (
                <div>
                    <span className="bg-[#C20059] text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center leading-none">
                        -{discountPercentage}% {language === 'ar' ? 'خصم' : 'OFF'}
                    </span>
                </div>
            )}
        </div>
    );
};

export default ProductPrice;
