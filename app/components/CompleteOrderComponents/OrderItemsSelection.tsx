"use client";

import React from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { getSafeImageUrl } from '@/lib/image-utils';

interface OrderItem {
    id: string;
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
        <div className="bg-[#FFFFFF] dark:bg-white/5 p-6 border-t border-[#f4f0f2] dark:border-[#3a2228]">
            <p className="text-[10px] font-bold text-[#89616f] uppercase tracking-widest mb-4 text-center">{t('orderComplete.items')}</p>
            <div className="flex justify-center flex-wrap gap-4">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="w-16 h-16 !bg-white rounded-lg border border-[#f4f0f2] relative group overflow-hidden"
                        title={item.product.name}
                    >
                        <img
                            src={getSafeImageUrl(item.product.images.split(',').map((img: string) => img.trim()).filter(Boolean)[0])}
                            alt={item.product.name}
                            className="w-full h-full object-contain p-1"
                            loading="lazy"
                        />
                        <span className="absolute -top-1.5 ltr:-right-1.5 rtl:-left-1.5 bg-primary text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-[0_2px_8px_rgba(230,118,174,0.4)] z-10 border border-white dark:border-[#2a161d]">
                            {item.quantity}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderItemsSelection;
