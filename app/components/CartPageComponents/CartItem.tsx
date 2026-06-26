"use client";

import React from 'react';
import Link from 'next/link';
import { MdDelete } from 'react-icons/md';
import { CartItem as CartItemType } from '@/app/context/CartContext';
import { useLanguage } from '@/app/context/LanguageContext';
import { getSafeImageUrl } from '@/lib/image-utils';


interface CartItemProps {
    item: CartItemType;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
}

const CartItem = ({ item, removeItem, updateQuantity }: CartItemProps) => {
    const { t } = useLanguage();

    return (
        <div className="flex items-center gap-4 md:gap-6 py-6 transition-all hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
            {/* Remove Button */}
            <button
                onClick={() => removeItem(item.id)}
                className="cursor-pointer text-gray-400 hover:text-black dark:hover:text-white transition-colors p-2 shrink-0 flex items-center justify-center"
            >
                <span className="text-[32px] font-light leading-none mb-1">×</span>
            </button>

            {/* Image */}
            <div className="shrink-0">
                <div className="relative w-[120px] h-[120px] !bg-white rounded-xl border border-[#E6E9EB] dark:border-gray-800/50 overflow-hidden shadow-sm">
                    <img
                        src={getSafeImageUrl(item.image.split(',')[0])}
                        alt={item.name}
                        className="w-full h-full object-contain p-2"
                        loading="lazy"
                    />
                </div>
            </div>

            {/* Content (Title/Price Left, Controls Right) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between flex-1 min-w-0 gap-4 md:gap-8">
                {/* Product Info */}
                <div className="flex flex-col gap-2 min-w-0">
                    <Link href={`/${item.slug}`} className="text-[16px] font-bold text-[#072835] dark:text-white transition-colors hover-underline-animated">
                        {item.name}
                    </Link>
                    <p dir="ltr" className="text-[15px] font-bold text-gray-500 dark:text-gray-400 text-right rtl:text-right md:text-left md:rtl:text-right w-fit">${item.price.toFixed(2)}</p>
                </div>

                {/* Controls and Total */}
                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 w-full md:w-auto mt-2 md:mt-0">
                    {/* Pill Quantity */}
                    <div className="flex items-center border border-[#E6E9EB] dark:border-white/10 rounded-full h-12 px-1 w-[120px] bg-white dark:bg-white/5 shrink-0">
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white transition-colors text-lg"
                        >−</button>
                        <input
                            className="flex-1 bg-transparent border-0 border-none text-center font-bold text-[15px] text-[#072835] dark:text-white focus:ring-0 focus:border-0 p-0 m-0 shadow-none outline-none ring-0 w-full"
                            readOnly
                            type="text"
                            value={item.quantity}
                        />
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white transition-colors text-lg"
                        >+</button>
                    </div>

                    {/* Total */}
                    <div className="text-right rtl:text-left min-w-[80px] shrink-0">
                        <p dir="ltr" className="font-bold text-[16px] text-[#072835] dark:text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
