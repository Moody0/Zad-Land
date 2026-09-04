"use client";

import Link from "next/link";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import ResilientImage from "@/app/components/ResilientImage";
import { useCurrency } from "@/app/context/CurrencyContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { useCart } from "@/app/context/CartContext";
import toast from "react-hot-toast";
import { MdSearch, MdShoppingBag, MdAdd, MdRemove } from "react-icons/md";

const QuickViewModal = dynamic(
    () => import("@/app/components/ProductsPageComponents/QuickViewModal"),
    { ssr: false }
);

export interface BrandProductItem {
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
    stock?: number;
    options?: string | null;
    isTrending?: boolean;
    category?: {
        id: string;
        name: string;
        slug: string;
    } | null;
    brand?: {
        id: string;
        name: string;
        slug: string;
    } | null;
}

interface BrandProductCardProps {
    product: BrandProductItem;
}

export default function BrandProductCard({ product }: BrandProductCardProps) {
    const { language, dir } = useLanguage();
    const { formatPrice } = useCurrency();
    const { items, addItem, updateQuantity, removeItem } = useCart();
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const isArabic = language === "ar";
    const isRtl = dir === "rtl";

    const displayName = (isArabic ? product.nameAr : product.nameEn) || product.name || product.nameAr || "";
    const displayDesc = isArabic
        ? (product.descriptionAr || product.description)
        : (product.descriptionEn || product.description);

    const parsedOptions = product.options 
        ? product.options.split(",").map((o) => o.trim()).filter(Boolean)
        : [];
    const defaultOption = parsedOptions.length > 0 ? parsedOptions[0] : undefined;

    const cartItem = items.find((item) => item.id === product.id);
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    const images = typeof product.images === "string"
        ? product.images.split(",").map((img) => img.trim()).filter(Boolean)
        : Array.isArray(product.images) ? product.images : [];
    
    const primaryImage = images[0] || "/placeholder.svg";

    const handleInitialAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            id: product.id,
            name: displayName,
            price: Number(product.discountPrice || product.price),
            image: primaryImage,
            slug: product.slug,
            quantity: 1,
            description: displayDesc || undefined,
            selectedOption: defaultOption,
        });
        toast.success(isArabic ? `تمت إضافة ${displayName} إلى السلة` : `Added ${displayName} to cart`);
    };

    const handleIncrease = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        updateQuantity(product.id, quantityInCart + 1, defaultOption);
    };

    const handleDecrease = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (quantityInCart <= 1) {
            removeItem(product.id, defaultOption);
        } else {
            updateQuantity(product.id, quantityInCart - 1, defaultOption);
        }
    };

    const categoryLabel = product.category?.name;

    return (
        <>
            <div 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/10 hover:border-[#072835]/30 dark:hover:border-white/20 hover:shadow-md transition-all duration-300 p-3 sm:p-4 w-full h-full"
            >
                {/* Trending Tag (Subtle & Restrained) */}
                {product.isTrending && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 pointer-events-none">
                        <span className="bg-[#B8860B] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs uppercase tracking-wider">
                            {isArabic ? "مميز" : "Featured"}
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
                    className={`absolute z-20 top-3 ${isRtl ? "right-3" : "left-3"} sm:top-4 ${isRtl ? "sm:right-3" : "sm:left-3"} w-7 h-7 sm:w-8 sm:h-8 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-sm text-slate-700 dark:text-slate-200 rounded-full flex items-center justify-center opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[#072835] hover:text-white dark:hover:bg-[#B8860B] dark:hover:text-white border border-slate-200 dark:border-white/10 shadow-xs`}
                    aria-label="Quick View"
                >
                    <MdSearch className="text-sm sm:text-base" />
                </button>

                {/* Product Image Frame */}
                <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-slate-50 dark:bg-zinc-800/50 p-2 flex items-center justify-center">
                    <Link href={`/products/${product.slug}`} className="relative block w-full h-full" aria-label={displayName}>
                        <ResilientImage
                            src={primaryImage}
                            alt={displayName}
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 260px"
                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                    </Link>
                </div>

                {/* Information Area */}
                <div className={`flex flex-col flex-1 mt-3 ${isRtl ? "text-right" : "text-left"}`}>
                    {/* Category / Sub-range Tag (Replaces redundant brand name!) */}
                    {categoryLabel && (
                        <span className="text-[10px] sm:text-[11px] font-bold text-[#B8860B] dark:text-[#E5B54A] mb-1 line-clamp-1">
                            {categoryLabel}
                        </span>
                    )}

                    {/* Product Title */}
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug mb-2">
                        <Link href={`/products/${product.slug}`} className="hover:text-[#072835] dark:hover:text-[#E5B54A] transition-colors">
                            {displayName}
                        </Link>
                    </h3>

                    {/* Wholesale Packaging & Pricing */}
                    <div className="mt-auto pt-2 border-t border-slate-100 dark:border-white/5 flex items-baseline justify-between gap-1">
                        <div className="flex items-baseline gap-1.5">
                            {product.discountPrice && Number(product.discountPrice) < Number(product.price) ? (
                                <>
                                    <span className="text-sm sm:text-base font-extrabold text-[#2E7D32] dark:text-[#4ade80]">
                                        {formatPrice(Number(product.discountPrice))}
                                    </span>
                                    <span className="text-[10px] sm:text-xs text-slate-400 line-through font-normal">
                                        {formatPrice(Number(product.price))}
                                    </span>
                                </>
                            ) : (
                                <span className="text-sm sm:text-base font-extrabold text-[#072835] dark:text-white">
                                    {formatPrice(Number(product.price))}
                                </span>
                            )}
                        </div>

                        {product.stock && product.stock > 0 ? (
                            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/5 shrink-0">
                                {product.stock} {isArabic ? "قطعة/طرد" : "pcs/ctn"}
                            </span>
                        ) : null}
                    </div>

                    {/* Add to Cart / Quantity Controller */}
                    <div className="mt-2.5 relative h-9 sm:h-10 w-full overflow-hidden rounded-xl">
                        {quantityInCart === 0 ? (
                            <button
                                onClick={handleInitialAdd}
                                className="w-full h-full bg-[#072835] hover:bg-[#2E7D32] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95 touch-manipulation select-none shadow-xs"
                            >
                                <MdShoppingBag className="text-sm sm:text-base shrink-0 text-white" />
                                <span className="truncate">{isArabic ? "إضافة للطلب" : "Add to Order"}</span>
                            </button>
                        ) : (
                            <div className="w-full h-full bg-[#2E7D32] text-white rounded-xl font-bold text-xs flex items-center justify-between px-1.5 sm:px-2 transition-all shadow-xs">
                                <button
                                    onClick={handleDecrease}
                                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors active:scale-90 touch-manipulation"
                                    aria-label="Decrease quantity"
                                >
                                    <MdRemove className="text-sm sm:text-base" />
                                </button>
                                
                                <span className="text-xs sm:text-sm font-extrabold tracking-wide px-1 select-none">
                                    {quantityInCart}
                                </span>

                                <button
                                    onClick={handleIncrease}
                                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors active:scale-90 touch-manipulation"
                                    aria-label="Increase quantity"
                                >
                                    <MdAdd className="text-sm sm:text-base" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isQuickViewOpen && (
                <QuickViewModal
                    product={product}
                    isOpen={isQuickViewOpen}
                    onClose={() => setIsQuickViewOpen(false)}
                />
            )}
        </>
    );
}
