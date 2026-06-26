"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { MdRemove, MdAdd } from "react-icons/md";
import { FaShieldAlt, FaShippingFast, FaLock } from "react-icons/fa";
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

    // Simulated stock for visual parity if not provided
    const displayStock = stock !== undefined ? stock : 3;
    const isLowStock = displayStock > 0 && displayStock <= 10;

    return (
        <div className="flex flex-col gap-4">
            {/* Stock Progress Bar - Always show if stock exists */}
            {displayStock > 0 && (
                <div className="w-full">
                    <div className="flex items-center justify-start mb-1">
                        <div className="flex items-center gap-2 text-[#000000] font-bold text-[14px]">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                            </span>
                            <span className="text-[#000000] font-bold text-[14px]">
                                {language === 'ar'
                                    ? `items left ${stock || 0}`
                                    : `items left ${stock || 0}`}
                            </span>
                        </div>
                    </div>
                    <div className="w-full h-[3px] bg-gray-100 rounded-full overflow-hidden mb-2">
                        <div
                            className="h-full bg-[#FF395A] transition-all duration-1000 ease-out"
                            style={{ width: `${(displayStock / 15) * 100}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Quantity and Add to Cart Row */}
            <div className="flex flex-row-reverse md:flex-row items-center gap-4">
                <button
                    onClick={handleAddToCart}
                    className="flex-1 h-[48px] bg-[#072835] hover:bg-[#051e28] text-white rounded-full font-bold text-[15px] transition-all duration-300 active:scale-[0.98] shadow-md shadow-[#072835]/20"
                >
                    {language === 'ar' ? 'اضافة للعربة' : 'Add to Cart'}
                </button>

                <div className="flex items-center h-[48px] border border-gray-200 dark:border-white/10 rounded-full bg-white dark:bg-white/5 px-2 shrink-0">
                    <button
                        onClick={handleDecrement}
                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                    >
                        <MdRemove size={20} />
                    </button>
                    <span className="w-10 text-center text-[16px] font-bold text-[#1C1C1C] dark:text-white">{quantity}</span>
                    <button
                        onClick={handleIncrement}
                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                    >
                        <MdAdd size={20} />
                    </button>
                </div>
            </div>

            <button
                onClick={handleBuyNow}
                className="w-full h-[48px] bg-[#C20059] hover:bg-[#a1004a] text-white rounded-full font-bold text-[15px] active:scale-[0.98] transition-all duration-300 shadow-md shadow-[#C20059]/20"
            >
                {language === 'ar' ? 'اشتري الان' : 'Buy it now'}
            </button>
        </div>
    );
};

export default ProductActions;
