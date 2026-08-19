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
        nameAr?: string | null;
        nameEn?: string | null;
        price: number;
        image: string;
        slug: string;
        options?: string | null;
        description?: string | null;
        descriptionAr?: string | null;
        descriptionEn?: string | null;
    };
    stock?: number;
}

const ProductActions = ({ product, stock }: ProductActionsProps) => {
    const { addItem } = useCart();
    const { language } = useLanguage();
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);

    const displayName = (language === 'ar' ? product.nameAr : product.nameEn) || product.name || product.nameAr || '';

    const displayDesc = language === 'ar'
        ? (product.descriptionAr || product.description)
        : (product.descriptionEn || product.description);

    const parsedOptions = product.options
        ? product.options.split(',').map(o => o.trim()).filter(Boolean)
        : [];
    const [selectedOption, setSelectedOption] = useState<string>(parsedOptions[0] || "");

    const handleIncrement = () => setQuantity(prev => prev + 1);
    const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: displayName,
            price: Number(product.price),
            image: product.image,
            slug: product.slug,
            quantity: quantity,
            description: displayDesc || undefined,
            selectedOption: selectedOption || undefined,
        });
        toast.success(language === 'ar'
            ? `تمت إضافة ${quantity} ${displayName} إلى السلة`
            : `Added ${quantity} ${displayName} to cart`
        );
    };

    const handleBuyNow = () => {
        addItem({
            id: product.id,
            name: displayName,
            price: Number(product.price),
            image: product.image,
            slug: product.slug,
            quantity: quantity,
            description: displayDesc || undefined,
            selectedOption: selectedOption || undefined,
        });
        router.push("/place-order");
    };

    const displayStock = stock !== undefined ? stock : 3;

    return (
        <div className="flex flex-col gap-4 my-2">
            {/* Options / Variants Selector */}
            {parsedOptions.length > 0 && (
                <div className="w-full bg-gray-50/80 dark:bg-zinc-800/40 p-3.5 rounded-2xl border border-gray-100 dark:border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                            {language === 'ar' ? 'الخيارات والأحجام:' : 'Options / Sizes:'}
                        </span>
                        {selectedOption && (
                            <span className="text-xs font-bold text-primary">
                                {selectedOption}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {parsedOptions.map((opt, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setSelectedOption(opt)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    selectedOption === opt
                                        ? 'bg-[#B8860B] text-white ring-2 ring-[#B8860B]/20'
                                        : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:border-[#B8860B]'
                                }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {/* Stock Indicator */}
            {displayStock > 0 && (
                <div className="w-full">
                    <div className="flex items-center justify-start mb-1.5">
                        <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-zinc-900 dark:text-white">
                            <span className="inline-flex rounded-full h-2.5 w-2.5 bg-[#2E7D32]"></span>
                            <span>
                                {language === 'ar'
                                    ? `متوفر في المخزون (${stock || displayStock} قطعة)`
                                    : `In Stock (${stock || displayStock} items left)`}
                            </span>
                        </div>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#2E7D32] transition-all duration-1000 ease-out"
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
                        className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[#B8860B] transition-colors"
                        aria-label="Decrease quantity"
                    >
                        <MdRemove size={18} />
                    </button>
                    <span className="w-8 text-center text-sm font-extrabold text-zinc-900 dark:text-white select-none">{quantity}</span>
                    <button
                        onClick={handleIncrement}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[#B8860B] transition-colors"
                        aria-label="Increase quantity"
                    >
                        <MdAdd size={18} />
                    </button>
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    className="flex-1 h-12 bg-[#072835] hover:bg-[#0c4054] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
                >
                    <MdShoppingBag size={18} className="text-[#B8860B]" />
                    <span>{language === 'ar' ? 'إضافة للسلة' : 'Add to Cart'}</span>
                </button>
            </div>

            {/* Buy Now Button */}
            <button
                onClick={handleBuyNow}
                className="w-full h-12 bg-[#2E7D32] hover:bg-[#236327] text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98]"
            >
                {language === 'ar' ? 'شراء الآن' : 'Buy Now'}
            </button>
        </div>
    );
};

export default ProductActions;
