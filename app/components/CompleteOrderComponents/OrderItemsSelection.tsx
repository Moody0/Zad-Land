"use client";

import React from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { getSafeImageUrl } from '@/lib/image-utils';

interface OrderItem {
    id: string;
    options?: string | null;
    product: {
        images: string;
        name: string;
    };
    quantity: number;
}

interface OrderItemsSelectionProps {
    items: OrderItem[];
}

const OrderItemsSelection = ({ items }: OrderItemsSelectionProps) => {
    const { t } = useLanguage();

    return (
        <div className="bg-gray-50/60 dark:bg-zinc-800/40 p-6 border-t border-gray-200 dark:border-white/10">
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 text-center">{t('orderComplete.items')}</p>
            <div className="flex justify-center flex-wrap gap-4">
                {items.map((item) => {
                    const itemTitle = item.options ? `${item.product.name} (${item.options})` : item.product.name;
                    return (
                        <div
                            key={item.id}
                            className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-white/10 relative group overflow-hidden"
                            title={itemTitle}
                        >
                            <img
                                src={getSafeImageUrl(item.product.images.split(',').map((img: string) => img.trim()).filter(Boolean)[0])}
                                alt={item.product.name}
                                className="w-full h-full object-contain p-1"
                                loading="lazy"
                            />
                            <span className="absolute -top-1.5 ltr:-right-1.5 rtl:-left-1.5 bg-[#2E7D32] text-white text-[10px] font-extrabold w-5 h-5 flex items-center justify-center rounded-full z-10 border border-white dark:border-zinc-900 shadow-sm">
                                {item.quantity}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderItemsSelection;
