"use client";

import React from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface ProductHeaderProps {
    name: string;
    brandName?: string;
    categoryName?: string;
    averageRating?: number;
    totalReviews?: number;
}

const ProductHeader = ({ name, brandName, categoryName, averageRating = 0, totalReviews = 0 }: ProductHeaderProps) => {
    const { language } = useLanguage();

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (averageRating >= i) {
                stars.push(<FaStar key={i} />);
            } else if (averageRating >= i - 0.5) {
                stars.push(<FaStarHalfAlt key={i} />);
            } else {
                stars.push(<FaRegStar key={i} />);
            }
        }
        return stars;
    };

    return (
        <div className="mb-2">
            <h1 
                dir="ltr" 
                className={`text-[#072835] dark:text-white text-[25px] md:text-[30px] font-semibold leading-[1.2] mb-3 font-sans tracking-normal ${language === 'ar' ? 'text-right' : 'text-left'}`}
            >
                {name}
            </h1>

            {/* Reviews Summary */}
            <div 
                className="flex items-center gap-2 mb-4 cursor-pointer group w-fit"
                onClick={() => {
                    document.getElementById('product-reviews')?.scrollIntoView({ behavior: 'smooth' });
                }}
            >
                <div className="flex text-[#C20059] text-[14px]">
                    {renderStars()}
                </div>
                <span className="text-[13px] text-gray-500 font-medium group-hover-underline-animated transition-colors border-b border-transparent group-hover:border-[#072835]">
                    {language === 'ar' ? `(${totalReviews} تقييم)` : `(${totalReviews} Reviews)`}
                </span>
            </div>

            <div className="flex items-center gap-4 text-[15px] font-semibold">
                {brandName && (
                    <div className="flex items-center gap-1.5">
                        <span className="text-[#000000]">{language === 'ar' ? 'البراند:' : 'Brand:'}</span>
                        <span className="text-[rgb(7,40,53)] border-b border-[rgb(7,40,53)]  transition-colors cursor-pointer">{brandName}</span>
                    </div>
                )}
                <span className="opacity-20">|</span>
                {categoryName && (
                    <div className="flex items-center gap-1.5">
                        <span className="text-[#000000]">{language === 'ar' ? 'النوع:' : 'Type:'}</span>
                        <span className="text-[rgb(7,40,53)] border-b border-[rgb(7,40,53)] transition-colors cursor-pointer">{categoryName}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductHeader;

