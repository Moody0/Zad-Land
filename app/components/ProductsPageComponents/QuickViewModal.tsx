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
    nameAr?: string | null;
    nameEn?: string | null;
    description: string | null;
    descriptionAr?: string | null;
    descriptionEn?: string | null;
    price: string | number;
    discountPrice?: string | number | null;
    images: string;
    categoryId?: string;
    stock?: number;
    options?: string | null;
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

    const parsedOptions = product.options 
        ? product.options.split(',').map(o => o.trim()).filter(Boolean)
        : [];
    const [selectedOption, setSelectedOption] = useState<string>(parsedOptions[0] || "");
    
    if (!isOpen) return null;

    const displayName = (language === 'ar' ? product.nameAr : product.nameEn) || product.name || product.nameAr || '';

    const displayDesc = language === 'ar'
        ? (product.descriptionAr || product.description)
        : (product.descriptionEn || product.description);

    const images = typeof product.images === 'string'
        ? product.images.split(',').map(img => img.trim()).filter(Boolean)
        : Array.isArray(product.images) ? product.images : [];

    const primaryImage = images[0] || '';

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: displayName,
            price: Number(product.discountPrice || product.price),
            image: primaryImage,
            slug: product.slug,
            quantity: quantity,
            description: displayDesc || undefined,
            selectedOption: selectedOption || undefined,
        });
        toast.success(language === 'ar' ? `تمت إضافة ${displayName} إلى السلة` : `Added ${displayName} to cart`);
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
                    className="absolute top-4 ltr:right-4 rtl:left-4 z-10 text-gray-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                >
                    <MdClose size={24} />
                </button>

                {/* Left side (Details) */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                    <h2 className={`text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-2 tracking-normal ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                        {displayName}
                    </h2>
                    
                    <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-gray-500">
                        {product.brand && (
                            <span>{language === 'ar' ? 'الشركة / الماركة:' : 'Brand:'} <span className="font-bold text-zinc-900 dark:text-white">{product.brand.name}</span></span>
                        )}
                    </div>

                    {/* Options Selector in Quick View */}
                    {parsedOptions.length > 0 && (
                        <div className="mb-4">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
                                {language === 'ar' ? 'الخيارات / الحجم:' : 'Select Option:'}
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {parsedOptions.map((opt, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setSelectedOption(opt)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                            selectedOption === opt
                                                ? 'bg-[#B8860B] text-white'
                                                : 'bg-gray-100 dark:bg-zinc-800 text-zinc-700 dark:text-gray-300 hover:bg-[#B8860B]/10 hover:text-[#B8860B]'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-6">
                        {product.discountPrice && Number(product.discountPrice) < Number(product.price) ? (
                            <div className="flex items-center gap-3">
                                <span className="text-[#2E7D32] dark:text-[#4ade80]">{formatPrice(Number(product.discountPrice))}</span>
                                <span className="text-base text-gray-400 line-through font-normal">{formatPrice(Number(product.price))}</span>
                            </div>
                        ) : (
                            <span>{formatPrice(Number(product.price))}</span>
                        )}
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <button 
                            onClick={handleAddToCart}
                            className="flex-1 bg-[#2E7D32] hover:bg-[#256628] text-white py-3 rounded-xl font-bold transition-all text-sm cursor-pointer"
                        >
                            {language === 'ar' ? 'إضافة للسلة' : 'Add to Cart'}
                        </button>
                        
                        <div className="flex items-center justify-between border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 w-28 bg-gray-50 dark:bg-zinc-800">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-500 hover:text-[#B8860B] font-bold cursor-pointer">-</button>
                            <span className="font-bold text-zinc-900 dark:text-white select-none">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="text-gray-500 hover:text-[#B8860B] font-bold cursor-pointer">+</button>
                        </div>
                    </div>

                    <Link 
                        href={`/products/${product.slug}`}
                        className="text-xs font-bold text-gray-500 hover:text-[#B8860B] flex items-center gap-1 transition-colors mt-2"
                        onClick={onClose}
                    >
                        {language === 'ar' ? 'عرض كل التفاصيل' : 'View full details'} →
                    </Link>
                </div>

                {/* Right side (Image) */}
                <div className="flex-1 bg-gray-50 dark:bg-zinc-800/40 relative min-h-[300px] md:min-h-[400px] flex items-center justify-center p-6">
                    <ResilientImage
                        src={primaryImage}
                        alt={displayName}
                        className="w-full h-full object-contain max-h-[350px]"
                    />
                </div>
            </div>
        </div>
    );
};

export default QuickViewModal;
