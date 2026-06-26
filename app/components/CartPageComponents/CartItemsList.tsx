"use client";

import React from 'react';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/app/context/CartContext';
import CartItem from './CartItem';
import { useLanguage } from '@/app/context/LanguageContext';
import { MdArrowBack } from 'react-icons/md';

interface CartItemsListProps {
    items: CartItemType[];
    cartCount: number;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
}

const CartItemsList = ({ items, cartCount, removeItem, updateQuantity }: CartItemsListProps) => {
    const { t, dir } = useLanguage();

    return (
        <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="flex flex-col gap-2 pb-4 border-b border-[#E6E9EB] dark:border-white/10">
                <h1 className="text-3xl font-black tracking-tight text-[#072835] dark:text-white">{t('cart.yourCart')}</h1>
                <p className="text-[14px] font-medium text-gray-500 dark:text-gray-400">{cartCount} {t('orderComplete.items')}</p>
            </div>
            <div className="flex flex-col border-y border-[#E6E9EB] dark:border-white/10 divide-y divide-[#E6E9EB] dark:divide-white/10">
                {items.map(item => (
                    <CartItem
                        key={item.id}
                        item={item}
                        removeItem={removeItem}
                        updateQuantity={updateQuantity}
                    />
                ))}
            </div>
            <div className="mt-4">
                <Link href="/products" className="relative inline-flex items-center gap-2 text-[14px] font-bold text-gray-500 transition-colors hover-underline-animated">
                    <MdArrowBack className={`text-sm ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    {t('cart.continueShopping')}
                </Link>
            </div>
        </div>
    );
};

export default CartItemsList;
