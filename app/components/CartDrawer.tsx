"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MdClose, MdShoppingBag, MdDelete } from 'react-icons/md';
import { useCart } from '@/app/context/CartContext';
import { useLanguage } from '@/app/context/LanguageContext';
import { useCurrency } from '@/app/context/CurrencyContext';

const CartDrawer = () => {
    const { items, isDrawerOpen, closeDrawer, subtotal, updateQuantity, removeItem } = useCart();
    const { t, dir } = useLanguage();
    const { formatPrice } = useCurrency();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isDrawerOpen]);

    if (!mounted) return null;

    const drawerTransform = dir === 'rtl' 
        ? (isDrawerOpen ? 'translate-x-0' : '-translate-x-full') 
        : (isDrawerOpen ? 'translate-x-0' : 'translate-x-full');

    return (
        <>
            {/* Overlay */}
            <div 
                className={`fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300 ${
                    isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={closeDrawer}
            />

            {/* Drawer Panel */}
            <div 
                className={`fixed top-0 bottom-0 z-[9999] w-full max-w-md bg-white dark:bg-[#1a1a1a] shadow-2xl transition-transform duration-300 transform ${drawerTransform} ${
                    dir === 'rtl' ? 'left-0' : 'right-0'
                } flex flex-col`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/10 shrink-0">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-text-main dark:text-white">
                        <MdShoppingBag />
                        {t('cart.title') || 'Your Cart'}
                        <span className="text-sm font-normal text-text-sub dark:text-white/60">
                            ({items.reduce((acc, item) => acc + item.quantity, 0)} {t('cart.items') || 'items'})
                        </span>
                    </h2>
                    <button 
                        onClick={closeDrawer}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                    >
                        <MdClose className="text-2xl text-text-main dark:text-white" />
                    </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-text-sub dark:text-white/60">
                            <MdShoppingBag className="text-6xl mb-4 opacity-20" />
                            <p className="text-lg mb-2">{t('cart.empty') || 'Your cart is empty'}</p>
                            <button 
                                onClick={closeDrawer}
                                className="text-primary font-medium hover:underline"
                            >
                                {t('common.continueShopping') || 'Continue Shopping'}
                            </button>
                        </div>
                    ) : (
                        items.map(item => (
                            <div key={item.id} className="bg-gray-50 dark:bg-white/5 p-3 rounded-xl flex gap-3 relative group">
                                <div 
                                    className="w-20 h-20 bg-gray-200 rounded-lg bg-cover bg-center shrink-0 border border-gray-100 dark:border-white/5"
                                    style={{ backgroundImage: `url('${item.image.split(',')[0]}')` }}
                                />
                                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                    <div className="pr-6">
                                        <Link 
                                            href={`/${item.slug}`} 
                                            onClick={closeDrawer}
                                            dir="ltr"
                                            className={`font-bold text-sm text-text-main dark:text-white line-clamp-2 leading-tight font-sans tracking-normal block ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                                        >
                                            <span className="hover-underline-animated">{item.name}</span>
                                        </Link>
                                        <p className="text-primary font-bold text-sm mt-1" dir="ltr">
                                            {formatPrice(item.price)}
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center bg-white dark:bg-white/10 rounded-lg border border-gray-100 dark:border-white/5 h-8">
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 rounded-l-lg transition-colors"
                                            >-</button>
                                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 rounded-r-lg transition-colors"
                                            >+</button>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => removeItem(item.id)}
                                        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors p-1"
                                    >
                                        <MdDelete className="text-lg" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-4 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#1a1a1a] shrink-0">
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-text-sub dark:text-white/60">{t('cart.subtotal') || 'Subtotal'}</span>
                                <span className="font-bold text-text-main dark:text-white" dir="ltr">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex items-center justify-between text-lg font-bold">
                                <span className="text-text-main dark:text-white">{t('cart.total') || 'Total'}</span>
                                <span className="text-primary" dir="ltr">{formatPrice(subtotal)}</span>
                            </div>
                        </div>
                        <Link
                            href="/cart"
                            onClick={closeDrawer}
                            className="block w-full bg-primary text-white text-center py-3.5 rounded-xl font-bold hover:bg-primary-dark transition-colors"
                        >
                            {t('cart.checkout') || 'Checkout'}
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;

