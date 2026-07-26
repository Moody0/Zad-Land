"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { MdRemove, MdAdd, MdShoppingBag } from "react-icons/md";
import toast from "react-hot-toast";

interface ProductActionsProps {
    product: {
        id: string;
        name: string;
        price: number;
        image: string;
        slug: string;
    };
    stock?: number;
}

const ProductActions = ({ product, stock }: ProductActionsProps) => {
    const { addItem } = useCart();
    const { language } = useLanguage();
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);

    const handleIncrement = () => setQuantity(prev => prev + 1);
    const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image,
            slug: product.slug,
            quantity: quantity,
        });
        toast.success(language === 'ar'
            ? `تمت إضافة ${quantity} ${product.name} إلى السلة`
            : `Added ${quantity} ${product.name} to cart`
        );
    };

    const handleBuyNow = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image,
            slug: product.slug,
            quantity: quantity,
        });
        router.push("/place-order");
    };

    const displayStock = stock !== undefined ? stock : 3;

    return (
        <div className="flex flex-col gap-4 my-2">
            {/* Stock Indicator */}
            {displayStock > 0 && (
                <div className="w-full">
                    <div className="flex items-center justify-start mb-1.5">
                        <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-zinc-900 dark:text-white">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span>
                                {language === 'ar'
                                    ? `متوفر في المخزون (${stock || displayStock} قطعة)`
                                    : `In Stock (${stock || displayStock} items left)`}
                            </span>
                        </div>
                    </div>
                    <div className="w-full h-1 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-zinc-900 dark:bg-white transition-all duration-1000 ease-out"
                            style={{ width: `${Math.min(100, (displayStock / 15) * 100)}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Quantity and Add to Cart Row */}
            <div className="flex items-center gap-3">
                {/* Quantity Controls */}
                <div className="flex items-center h-12 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-zinc-800/50 px-2 shrink-0">
                    <button
                        onClick={handleDecrement}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                        aria-label="Decrease quantity"
                    >
                        <MdRemove size={18} />
                    </button>
                    <span className="w-8 text-center text-sm font-extrabold text-zinc-900 dark:text-white select-none">{quantity}</span>
                    <button
                        onClick={handleIncrement}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                        aria-label="Increase quantity"
                    >
                        <MdAdd size={18} />
                    </button>
                </div>

                {/* Add to Cart Button (No Glow) */}
                <button
                    onClick={handleAddToCart}
                    className="flex-1 h-12 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
                >
                    <MdShoppingBag size={18} />
                    <span>{language === 'ar' ? 'إضافة للسلة' : 'Add to Cart'}</span>
                </button>
            </div>

            {/* Buy Now Button (No Glow) */}
            <button
                onClick={handleBuyNow}
                className="w-full h-12 bg-[#C20059] hover:bg-[#a1004a] text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98]"
            >
                {language === 'ar' ? 'شراء الآن' : 'Buy Now'}
            </button>
        </div>
    );
};

export default ProductActions;
