"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import ResilientImage from '@/app/components/ResilientImage';
import { useCurrency } from '@/app/context/CurrencyContext';
import { useLanguage } from '@/app/context/LanguageContext';
import { useCart } from '@/app/context/CartContext';
import toast from 'react-hot-toast';
import { MdSearch } from 'react-icons/md';
import QuickViewModal from './QuickViewModal';

interface Product {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    price: string | number;
    discountPrice?: string | number | null;
    images: string;
    categoryId: string;
    stock: number;
    isTrending: boolean;
    brand?: {
        id: string;
        name: string;
        slug: string;
        group?: string;
    } | null;
}

interface ProductCardProps {
    product: Product;
    variant?: 'default' | 'compact';
    badge?: string | null;
    showBadge?: boolean;
}

const ProductCard = ({ product, variant = 'default', badge, showBadge = true }: ProductCardProps) => {
    const { t, language, dir } = useLanguage();
    const { formatPrice } = useCurrency();
    const { addItem } = useCart();
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const [isSecondaryLoaded, setIsSecondaryLoaded] = useState(false);

    const images = product.images.split(',').map(img => img.trim()).filter(Boolean);
    const primaryImage = images[0] || '';
    const secondaryImage = images.length > 1 && images[1] !== images[0] ? images[1] : null;
    const hasSecondaryImage = !!secondaryImage;

    const handleQuickAdd = (e: React.MouseEvent) => {
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

    return (
        <>
            <div
                className="group relative flex flex-col bg-[#F7F7F5] dark:bg-surface-dark rounded-[10px] overflow-hidden transition-transform duration-300 w-full h-[309px] md:h-[461px]"
            >
                {/* Quick View Search Icon */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsQuickViewOpen(true);
                    }}
                    className="absolute z-20 top-4 left-4 w-10 h-10 bg-white text-black hover:bg-black hover:text-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100"
                    aria-label="Quick View"
                >
                    <MdSearch size={22} />
                </button>

                {/* Trending Badge or Custom Badge */}
                {showBadge && (product.isTrending || badge) && (
                    <div className="absolute top-2 right-3 md:top-3 md:right-5 z-20 pointer-events-none">
                        <span className="inline-block bg-[#C20059] text-white px-2 py-0.5 md:px-3 md:py-1 rounded text-[9px] md:text-[10px] font-medium tracking-wider uppercase shadow-md leading-tight">
                            {product.isTrending ? (language === 'ar' ? 'Trending' : 'Trending') : badge}
                        </span>
                    </div>
                )}

                {/* Image Area */}
                <div className="relative w-full h-[180px] md:h-[321px] overflow-hidden">
                    <Link href={`/products/${product.slug}`} className="absolute inset-0 block w-full h-full" aria-label={product.name}>
                        {/* Primary Image Wrapper */}
                        <div className={`absolute inset-0 transition-opacity duration-500 z-10 ${hasSecondaryImage && isSecondaryLoaded ? 'group-hover:opacity-0' : ''}`}>
                            <ResilientImage
                                alt={product.name}
                                className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
                                src={primaryImage}
                                loading="lazy"
                            />
                        </div>
                        
                        {/* Secondary Image Wrapper */}
                        {hasSecondaryImage && (
                            <div className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100 z-0">
                                <ResilientImage
                                    alt={product.name}
                                    className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
                                    src={secondaryImage}
                                    loading="lazy"
                                    onLoad={() => setIsSecondaryLoaded(true)}
                                />
                            </div>
                        )}
                    </Link>

                    {/* Shopping Bag Icon (Mobile/Visible) */}
                    <button
                        onClick={handleQuickAdd}
                        className="absolute bottom-2 left-2 md:bottom-3 md:left-3 z-20 w-8 h-8 md:w-10 md:h-10 bg-white text-black rounded-full shadow-md flex items-center justify-center transition-transform active:scale-90 md:hidden"
                        aria-label="Add to cart"
                    >
                        <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>

                    {/* Add to Cart Button */}
                    <div className="absolute inset-x-4 bottom-6 z-20 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <button
                            onClick={handleQuickAdd}
                            className="w-full bg-white hover:bg-black text-black hover:text-white h-[48px] rounded-full text-sm md:text-[15px] font-bold shadow-lg transition-all duration-300 flex items-center justify-center"
                        >
                            {language === 'ar' ? 'اضافة للعربة' : 'Add to Cart'}
                        </button>
                    </div>
                </div>

                {/* Product Info */}
                <div className={`flex flex-col p-3 md:p-5 mt-1 md:mt-3 pt-0 md:pt-0 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    {/* Brand */}
                    {product.brand && (
                        <p className="text-[rgba(7,40,53,0.6)] dark:text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 md:mb-1.5">
                            {product.brand.name}
                        </p>
                    )}

                    {/* Title */}
                    <h3 
                        dir="ltr"
                        className={`text-[rgb(7,40,53)] dark:text-white text-[13px] md:text-[15px] font-semibold leading-tight mb-1 md:mb-2 line-clamp-2 font-sans tracking-normal ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                    >
                        <span>
                            <Link href={`/products/${product.slug}`} className="hover-underline-animated">
                                {product.name}
                            </Link>
                        </span>
                    </h3>

                    {/* Price */}
                    <div className={`flex flex-row items-center gap-2 mt-auto text-[rgb(7,40,53)] dark:text-white ${dir === 'rtl' ? 'justify-start' : 'justify-start'}`}>
                        {product.discountPrice ? (
                            <>
                                <span className="text-[14px] md:text-[16px] font-bold text-[rgb(7,40,53)] dark:text-white">{formatPrice(Number(product.discountPrice))}</span>
                                <span className="text-[11px] md:text-[13px] text-gray-400 line-through font-normal">{formatPrice(Number(product.price))}</span>
                            </>
                        ) : (
                            <span className="text-[14px] md:text-[16px] font-bold">{formatPrice(Number(product.price))}</span>
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
