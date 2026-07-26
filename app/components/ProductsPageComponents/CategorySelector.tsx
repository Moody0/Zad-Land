"use client";

import Link from "next/link";
import React, { useRef, useEffect } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { MdGridView } from "react-icons/md";
import ResilientImage from "@/app/components/ResilientImage";

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
}

interface CategorySelectorProps {
    categories: Category[];
    activeCategory?: Category | null;
    activeMainCategory?: { id: string; name: string; slug: string } | null;
}

function getCategoryHref(slug?: string | null) {
    return slug ? `/categories/${slug}` : "/products";
}

const CategorySelector = ({ categories, activeCategory = null }: CategorySelectorProps) => {
    const { t } = useLanguage();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeCategory && scrollContainerRef.current) {
            const activeEl = document.getElementById(`category-item-${activeCategory.slug}`);
            if (activeEl) {
                setTimeout(() => {
                    activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }, 100);
            }
        }
    }, [activeCategory]);

    return (
        <div className="mb-6">
            <div 
                ref={scrollContainerRef}
                className="flex items-center gap-4 sm:gap-5 overflow-x-auto hide-scrollbar py-1 px-0.5 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {/* All Products Circle */}
                <Link
                    href="/products"
                    className="shrink-0 flex flex-col items-center gap-2 group transition-transform duration-200 active:scale-95"
                >
                    <div className={`w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] rounded-full p-0.5 transition-all duration-300 ${
                        !activeCategory 
                        ? 'border-2 border-zinc-900 dark:border-white' 
                        : 'border border-gray-200 dark:border-white/10 group-hover:border-zinc-900 dark:group-hover:border-white'
                    }`}>
                        <div className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-300 ${
                            !activeCategory
                            ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                            : 'bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white'
                        }`}>
                            <MdGridView className="text-2xl sm:text-3xl" />
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className={`text-[11px] sm:text-xs font-semibold text-center leading-tight line-clamp-1 ${
                            !activeCategory ? 'text-zinc-900 dark:text-white font-bold' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                        }`}>
                            {t("products.allProducts")}
                        </span>
                    </div>
                </Link>

                {/* Category Circles */}
                {categories.map((category) => {
                    const isActive = activeCategory?.slug === category.slug;
                    const defaultImage = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300';
                    const imageToUse = category.image || defaultImage;
                    
                    return (
                        <Link
                            key={category.id}
                            id={`category-item-${category.slug}`}
                            href={getCategoryHref(category.slug)}
                            className="shrink-0 flex flex-col items-center gap-2 group transition-transform duration-200 active:scale-95"
                        >
                            {/* Matching Homepage Charcoal/Black Border Style */}
                            <div className={`w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] rounded-full p-0.5 transition-all duration-300 ${
                                isActive 
                                ? 'border-2 border-zinc-900 dark:border-white' 
                                : 'border border-gray-200 dark:border-white/10 group-hover:border-zinc-900 dark:group-hover:border-white'
                            }`}>
                                <div className="w-full h-full rounded-full overflow-hidden bg-gray-50 dark:bg-zinc-900">
                                    <ResilientImage 
                                        src={imageToUse} 
                                        alt={category.name} 
                                        className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                            </div>

                            {/* Label */}
                            <div className="flex flex-col items-center max-w-[72px] sm:max-w-[80px]">
                                <span className={`text-[11px] sm:text-xs font-semibold text-center leading-tight line-clamp-1 transition-colors duration-200 ${
                                    isActive 
                                    ? 'text-zinc-900 dark:text-white font-bold' 
                                    : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                                }`}>
                                    {category.name}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default CategorySelector;
