"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import ResilientImage from '@/app/components/ResilientImage';
import { useCurrency } from '@/app/context/CurrencyContext';
import { useLanguage } from '@/app/context/LanguageContext';
import { useCart } from '@/app/context/CartContext';
import toast from 'react-hot-toast';
import { MdSearch, MdShoppingBag, MdAdd, MdRemove } from 'react-icons/md';
import QuickViewModal from './QuickViewModal';

export interface Product {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    price: string | number;
    discountPrice?: string | number | null;
    images: string;
    categoryId?: string;
    stock?: number;
    isTrending?: boolean;
    brand?: {
        id: string;
        name: string;
        slug: string;
        group?: string;
    } | null;
}

export interface ProductCardProps {
    product: Product;
    variant?: 'default' | 'compact';
    badge?: string | null;
    showBadge?: boolean;
    isFeaturedSpan?: boolean;
}

const ProductCard = ({ product, badge, showBadge = true }: ProductCardProps) => {
    const { language, dir } = useLanguage();
    const { formatPrice } = useCurrency();
    const { items, addItem, updateQuantity, removeItem } = useCart();
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const [isSecondaryLoaded, setIsSecondaryLoaded] = useState(false);

    // Check if this item is in cart
    const cartItem = items.find(item => item.id === product.id);
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    const images = typeof product.images === 'string'
        ? product.images.split(',').map(img => img.trim()).filter(Boolean)
        : Array.isArray(product.images) ? product.images : [];
    
    const primaryImage = images[0] || '';
    const secondaryImage = images.length > 1 && images[1] !== images[0] ? images[1] : null;
    const hasSecondaryImage = !!secondaryImage;

    const handleInitialAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.discountPrice || product.price),
            image: primaryImage,
            slug: product.slug,
            quantity: 1,
            description: product.description || undefined
        });
        toast.success(language === 'ar' ? `تمت إضافة ${product.name} إلى السلة` : `Added ${product.name} to cart`);
    };

    const handleIncrease = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        updateQuantity(product.id, quantityInCart + 1);
    };

    const handleDecrease = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (quantityInCart <= 1) {
            removeItem(product.id);
        } else {
            updateQuantity(product.id, quantityInCart - 1);
        }
    };

    const displayBadge = product.isTrending ? (language === 'ar' ? 'Trending' : 'Trending') : badge;

    return (
        <>
            <div className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100 dark:border-white/10 p-2.5 sm:p-4 w-full h-full">
                
                {/* Badge matching Homepage #C20059 */}
                {showBadge && (product.isTrending || badge) && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 pointer-events-none">
                        <span className="bg-[#C20059] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                            {displayBadge}
                        </span>
                    </div>
                )}

                {/* Quick View Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsQuickViewOpen(true);
                    }}
                    className="absolute z-20 top-3 left-3 sm:top-4 sm:left-4 w-7 h-7 sm:w-8 sm:h-8 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-full shadow-sm flex items-center justify-center opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                    aria-label="Quick View"
                >
                    <MdSearch className="text-sm sm:text-base" />
                </button>

                {/* Image Area (Square, optimized padding) */}
                <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-gray-50/80 dark:bg-zinc-800/40 p-2 flex items-center justify-center">
                    <Link href={`/products/${product.slug}`} className="absolute inset-0 block w-full h-full p-2" aria-label={product.name}>
                        {/* Primary Image Wrapper */}
                        <div className={`absolute inset-2 transition-all duration-500 z-10 ${hasSecondaryImage && isSecondaryLoaded ? 'group-hover:opacity-0' : ''}`}>
                            <ResilientImage
                                alt={product.name}
                                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                src={primaryImage}
                                loading="lazy"
                            />
                        </div>
                        
                        {/* Secondary Image Wrapper */}
                        {hasSecondaryImage && (
                            <div className="absolute inset-2 transition-all duration-500 opacity-0 group-hover:opacity-100 z-0">
                                <ResilientImage
                                    alt={product.name}
                                    className="w-full h-full object-contain transition-transform duration-500 scale-100 group-hover:scale-105"
                                    src={secondaryImage}
                                    loading="lazy"
                                    onLoad={() => setIsSecondaryLoaded(true)}
                                />
                            </div>
                        )}
                    </Link>
                </div>

                {/* Information Area */}
                <div className={`flex flex-col flex-1 mt-2.5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    
                    {/* Brand */}
                    <span className="text-[9px] sm:text-xs font-bold uppercase tracking-widest text-[rgba(7,40,53,0.6)] dark:text-gray-400 mb-0.5 line-clamp-1">
                        {product.brand?.name || 'Ruby Beauty'}
                    </span>

                    {/* Title */}
                    <h3 
                        dir="ltr"
                        className={`text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white line-clamp-2 leading-snug mb-1.5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                    >
                        <Link href={`/products/${product.slug}`} className="hover:underline">
                            {product.name}
                        </Link>
                    </h3>

                    {/* Price */}
                    <div className="mt-auto flex items-baseline gap-1.5 sm:gap-2 text-zinc-900 dark:text-white">
                        {product.discountPrice && Number(product.discountPrice) < Number(product.price) ? (
                            <>
                                <span className="text-xs sm:text-base font-extrabold">{formatPrice(Number(product.discountPrice))}</span>
                                <span className="text-[10px] sm:text-xs text-gray-400 line-through font-normal">{formatPrice(Number(product.price))}</span>
                            </>
                        ) : (
                            <span className="text-xs sm:text-base font-extrabold">{formatPrice(Number(product.price))}</span>
                        )}
                    </div>

                    {/* Mobile-Optimized Touch Target Add to Cart / Quantity Controller */}
                    <div className="mt-2.5 relative h-9 sm:h-10 w-full overflow-hidden rounded-xl">
                        {quantityInCart === 0 ? (
                            <button
                                onClick={handleInitialAdd}
                                className="w-full h-full bg-[#181113] hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black rounded-xl font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 touch-manipulation select-none"
                            >
                                <MdShoppingBag className="text-sm sm:text-base shrink-0" />
                                <span className="truncate">{language === 'ar' ? 'إضافة للسلة' : 'Add to Cart'}</span>
                            </button>
                        ) : (
                            <div className="w-full h-full bg-[#181113] dark:bg-white text-white dark:text-black rounded-xl font-bold text-xs flex items-center justify-between px-1.5 sm:px-2 shadow-sm transition-all duration-300 animate-scaleUp">
                                <button
                                    onClick={handleDecrease}
                                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 flex items-center justify-center transition-colors active:scale-90 touch-manipulation"
                                    aria-label="Decrease quantity"
                                >
                                    <MdRemove className="text-sm sm:text-base" />
                                </button>
                                
                                <span className="text-xs sm:text-sm font-extrabold tracking-wide px-1 select-none">
                                    {quantityInCart}
                                </span>

                                <button
                                    onClick={handleIncrease}
                                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 flex items-center justify-center transition-colors active:scale-90 touch-manipulation"
                                    aria-label="Increase quantity"
                                >
                                    <MdAdd className="text-sm sm:text-base" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <QuickViewModal
                product={product}
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
            />
        </>
    );
};

export default ProductCard;
