"use client";

import Link from "next/link";
import React, { useRef, useEffect, useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { MdGridView, MdChevronLeft, MdChevronRight } from "react-icons/md";
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
    const { t, dir } = useLanguage();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const isRtl = dir === 'rtl';

    const updateArrowVisibility = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            
            // Check if scrollable
            const isScrollable = scrollWidth > clientWidth;
            if (!isScrollable) {
                setShowLeftArrow(false);
                setShowRightArrow(false);
                return;
            }

            const maxScroll = scrollWidth - clientWidth;
            const currentScroll = Math.abs(scrollLeft);

            if (isRtl) {
                setShowLeftArrow(currentScroll < maxScroll - 5);
                setShowRightArrow(currentScroll > 5);
            } else {
                setShowLeftArrow(currentScroll > 5);
                setShowRightArrow(currentScroll < maxScroll - 5);
            }
        }
    };

    useEffect(() => {
        updateArrowVisibility();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', updateArrowVisibility);
            window.addEventListener('resize', updateArrowVisibility);
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', updateArrowVisibility);
            }
            window.removeEventListener('resize', updateArrowVisibility);
        };
    }, [categories, isRtl]);

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

    const handleScroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const distance = 320;
            const multiplier = direction === 'left' ? -1 : 1;
            scrollContainerRef.current.scrollBy({
                left: multiplier * distance * (isRtl ? -1 : 1),
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="relative mb-6 group">
            {/* Scroll Left Arrow (Desktop) */}
            {showLeftArrow && (
                <button
                    type="button"
                    onClick={() => handleScroll('left')}
                    aria-label="Scroll left"
                    className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-9 h-9 rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 text-zinc-900 dark:text-white hover:bg-[#B8860B] hover:text-white hover:border-[#B8860B] dark:hover:bg-[#B8860B] dark:hover:text-white items-center justify-center transition-all cursor-pointer z-20"
                >
                    <MdChevronLeft className="text-2xl" />
                </button>
            )}

            {/* Scroll Container */}
            <div 
                ref={scrollContainerRef}
                className="flex items-center gap-4 sm:gap-5 overflow-x-auto hide-scrollbar py-1 px-0.5 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {/* All Products Circle */}
                <Link
                    href="/products"
                    className="shrink-0 flex flex-col items-center gap-2 group/item transition-transform duration-200 active:scale-95"
                >
                    <div className={`w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] rounded-full p-0.5 transition-all duration-300 ${
                        !activeCategory 
                        ? 'border-2 border-[#B8860B] ring-2 ring-[#B8860B]/20' 
                        : 'border border-gray-200 dark:border-white/10 group-hover/item:border-[#B8860B]'
                    }`}>
                        <div className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-300 ${
                            !activeCategory
                            ? 'bg-[#B8860B] text-white'
                            : 'bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 group-hover/item:text-[#B8860B]'
                        }`}>
                            <MdGridView className="text-2xl sm:text-3xl" />
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className={`text-[11px] sm:text-xs font-semibold text-center leading-tight line-clamp-1 ${
                            !activeCategory ? 'text-[#B8860B] dark:text-[#E5B54A] font-bold' : 'text-gray-600 dark:text-gray-400 group-hover/item:text-[#B8860B]'
                        }`}>
                            {t("products.allProducts")}
                        </span>
                    </div>
                </Link>

                {/* Category Circles */}
                {categories.map((category) => {
                    const isActive = activeCategory?.slug === category.slug;
                    const defaultImage = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300';
                    const imageToUse = category.image || defaultImage;
                    
                    return (
                        <Link
                            key={category.id}
                            id={`category-item-${category.slug}`}
                            href={getCategoryHref(category.slug)}
                            className="shrink-0 flex flex-col items-center gap-2 group/item transition-transform duration-200 active:scale-95"
                        >
                            <div className={`w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] rounded-full p-0.5 transition-all duration-300 ${
                                isActive 
                                ? 'border-2 border-[#B8860B] ring-2 ring-[#B8860B]/25' 
                                : 'border border-gray-200 dark:border-white/10 group-hover/item:border-[#B8860B]'
                            }`}>
                                <div className="w-full h-full rounded-full overflow-hidden bg-gray-50 dark:bg-zinc-900">
                                    <ResilientImage 
                                        src={imageToUse} 
                                        alt={category.name} 
                                        className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover/item:scale-110"
                                    />
                                </div>
                            </div>

                            {/* Label */}
                            <div className="flex flex-col items-center max-w-[72px] sm:max-w-[80px]">
                                <span className={`text-[11px] sm:text-xs font-semibold text-center leading-tight line-clamp-1 transition-colors duration-200 ${
                                    isActive 
                                    ? 'text-[#B8860B] dark:text-[#E5B54A] font-bold' 
                                    : 'text-gray-600 dark:text-gray-400 group-hover/item:text-[#B8860B] dark:group-hover/item:text-[#E5B54A]'
                                }`}>
                                    {category.name}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Scroll Right Arrow (Desktop) */}
            {showRightArrow && (
                <button
                    type="button"
                    onClick={() => handleScroll('right')}
                    aria-label="Scroll right"
                    className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-9 h-9 rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 text-zinc-900 dark:text-white hover:bg-[#B8860B] hover:text-white hover:border-[#B8860B] dark:hover:bg-[#B8860B] dark:hover:text-white items-center justify-center transition-all cursor-pointer z-20"
                >
                    <MdChevronRight className="text-2xl" />
                </button>
            )}
        </div>
    );
};

export default CategorySelector;
