"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import ResilientImage from '@/app/components/ResilientImage';
import { useCurrency } from '@/app/context/CurrencyContext';
import { useLanguage } from '@/app/context/LanguageContext';
import { useCart } from '@/app/context/CartContext';
import toast from 'react-hot-toast';
import { MdClose } from 'react-icons/md';

interface Product {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    price: string | number;
    discountPrice?: string | number | null;
    images: string;
    categoryId?: string;
    stock?: number;
    brand?: {
        name: string;
    } | null;
}

interface QuickViewModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

const QuickViewModal = ({ product, isOpen, onClose }: QuickViewModalProps) => {
    const { language, dir } = useLanguage();
    const { formatPrice } = useCurrency();
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(1);
    
    if (!isOpen) return null;

    const images = typeof product.images === 'string'
        ? product.images.split(',').map(img => img.trim()).filter(Boolean)
        : Array.isArray(product.images) ? product.images : [];

    const primaryImage = images[0] || '';

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.discountPrice || product.price),
            image: primaryImage,
            slug: product.slug,
            quantity: quantity,
            description: product.description || undefined
        });
        toast.success(language === 'ar' ? `تمت إضافة ${product.name} إلى السلة` : `Added ${product.name} to cart`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div 
                className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden w-full max-w-[800px] flex flex-col md:flex-row relative border border-gray-100 dark:border-white/10"
                onClick={e => e.stopPropagation()}
                dir={dir}
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 ltr:right-4 rtl:left-4 z-10 text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                >
                    <MdClose size={24} />
                </button>

                {/* Left side (Details) */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                    <h2 dir="ltr" className={`text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-2 font-sans tracking-normal ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{product.name}</h2>
                    
                    <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-gray-500">
                        {product.brand && (
                            <span>{language === 'ar' ? 'البراند:' : 'Brand:'} <span className="font-bold text-zinc-900 dark:text-white">{product.brand.name}</span></span>
                        )}
                    </div>

                    <div className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-6">
                        {product.discountPrice && Number(product.discountPrice) < Number(product.price) ? (
                            <div className="flex items-center gap-3">
                                <span>{formatPrice(Number(product.discountPrice))}</span>
                                <span className="text-base text-gray-400 line-through font-normal">{formatPrice(Number(product.price))}</span>
                            </div>
                        ) : (
                            <span>{formatPrice(Number(product.price))}</span>
                        )}
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <button 
                            onClick={handleAddToCart}
                            className="flex-1 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black py-3 rounded-xl font-bold transition-colors text-sm"
                        >
                            {language === 'ar' ? 'اضافة للعربة' : 'Add to Cart'}
                        </button>
                        
                        <div className="flex items-center justify-between border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 w-28 bg-gray-50 dark:bg-zinc-800">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-500 hover:text-black dark:hover:text-white font-bold">-</button>
                            <span className="font-bold text-zinc-900 dark:text-white">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="text-gray-500 hover:text-black dark:hover:text-white font-bold">+</button>
                        </div>
                    </div>

                    <Link 
                        href={`/products/${product.slug}`}
                        className="text-xs font-bold text-gray-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 transition-colors mt-2"
                        onClick={onClose}
                    >
                        {language === 'ar' ? 'عرض كل التفاصيل' : 'View full details'} →
                    </Link>
                </div>

                {/* Right side (Image) */}
                <div className="flex-1 bg-gray-50 dark:bg-zinc-800/40 relative min-h-[300px] md:min-h-[400px] flex items-center justify-center p-6">
                    <ResilientImage
                        src={primaryImage}
                        alt={product.name}
                        className="w-full h-full object-contain max-h-[350px]"
                    />
                </div>
            </div>
        </div>
    );
};

export default QuickViewModal;
