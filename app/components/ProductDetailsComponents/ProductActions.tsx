"use client";

import React, { useState } from 'react';
import { useCart } from "@/app/context/CartContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { MdRemove, MdAdd, MdShoppingBag } from "react-icons/md";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';

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

    // Options parsing
    const parsedOptions = product.options 
        ? product.options.split(',').map(o => o.trim()).filter(Boolean)
        : [];
    const [selectedOption, setSelectedOption] = useState<string>(
        parsedOptions.length > 0 ? parsedOptions[0] : ""
    );

    const displayName = (language === 'ar' ? product.nameAr : product.nameEn) || product.name || product.nameAr || '';
    const displayDesc = language === 'ar'
        ? (product.descriptionAr || product.description)
        : (product.descriptionEn || product.description);

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleIncrement = () => {
        setQuantity(quantity + 1);
    };

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
        toast.success(language === 'ar' ? 'تمت إضافة المنتج إلى السلة' : 'Added to cart');
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

    const displayStock = stock !== undefined ? stock : 1;

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
                            <span className="text-xs font-bold text-[#B8860B]">
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

            {/* Wholesale Packaging & Availability Badge */}
            <div className="w-full rounded-2xl bg-[#FAF6EC] dark:bg-zinc-800/60 border border-[#B8860B]/25 dark:border-white/10 p-3.5 flex flex-col gap-2 shadow-2xs">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#072835] dark:text-white">
                        <span className="inline-flex rounded-full h-2.5 w-2.5 bg-[#2E7D32]"></span>
                        <span>
                            {language === 'ar' ? 'متوفر للتوريد المباشر بالجملة' : 'In Stock for Wholesale Supply'}
                        </span>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] dark:bg-[#2E7D32]/20 dark:text-[#4ade80]">
                        {language === 'ar' ? 'بيع بالجملة' : 'Wholesale B2B'}
                    </span>
                </div>

                {displayStock > 0 && (
                    <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-gray-300 font-semibold pt-2 border-t border-[#B8860B]/15 dark:border-white/5">
                        <span>
                            {language === 'ar' 
                                ? `مواصفات التعبئة: ${stock || displayStock} قطعة في الطرد / الكرتونة (البيع بالطرد الكامل)` 
                                : `Packaging Unit: ${stock || displayStock} Pieces per Carton / Box (Sold by Full Carton)`}
                        </span>
                    </div>
                )}
            </div>

            {/* Quantity and Add to Cart Row */}
            <div className="flex flex-col gap-1.5 mt-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-gray-300 px-0.5">
                    <span>{language === 'ar' ? 'عدد الطرود / الكراتين المطلوبة:' : 'Quantity (Full Cartons):'}</span>
                    {displayStock > 0 && (
                        <span className="text-[#B8860B] dark:text-[#E5B54A] font-semibold">
                            {quantity * (stock || displayStock)} {language === 'ar' ? 'قطعة إجمالاً' : 'Total Pieces'}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center h-12 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-zinc-800/50 px-2 shrink-0">
                        <button
                            onClick={handleDecrement}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[#B8860B] transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                        >
                            <MdRemove size={18} />
                        </button>
                        <span className="w-8 text-center text-sm font-extrabold text-zinc-900 dark:text-white select-none">{quantity}</span>
                        <button
                            onClick={handleIncrement}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[#B8860B] transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                        >
                            <MdAdd size={18} />
                        </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        className="flex-1 h-12 bg-[#072835] hover:bg-[#0c4054] dark:bg-[#B8860B] dark:hover:bg-[#9a7009] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99] cursor-pointer"
                    >
                        <MdShoppingBag className="text-lg" />
                        <span>{language === 'ar' ? 'إضافة للطلبية' : 'Add to Cart'}</span>
                    </button>
                </div>
            </div>

            {/* Buy Now Button */}
            <button
                onClick={handleBuyNow}
                className="w-full h-12 bg-[#2E7D32] hover:bg-[#236327] text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] shadow-sm cursor-pointer"
            >
                {language === 'ar' ? 'شراء وتثبيت الطلب' : 'Buy Now'}
            </button>
        </div>
    );
};

export default ProductActions;
