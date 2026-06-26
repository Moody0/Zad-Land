"use client";

import Link from "next/link";
import React, { useRef, useEffect, useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { MdChevronLeft, MdChevronRight, MdGridView } from "react-icons/md";
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
    const [showRightArrow, setShowRightArrow] = useState(true);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const isRtl = window.getComputedStyle(container).direction === 'rtl';
        
        const firstChild = container.firstElementChild as HTMLElement;
        const lastChild = container.lastElementChild as HTMLElement;
        
        if (!firstChild || !lastChild) return;
        
        const containerRect = container.getBoundingClientRect();
        const firstRect = firstChild.getBoundingClientRect();
        const lastRect = lastChild.getBoundingClientRect();

        // In RTL, the "start" is the first child, which should be on the right.
        // The "end" is the last child, which should be on the left.
        if (isRtl) {
            // We can scroll right (towards start) if the first child is NOT fully visible at the right edge
            setShowRightArrow(Math.round(firstRect.right) > Math.round(containerRect.right) + 5);
            // We can scroll left (towards end) if the last child is NOT fully visible at the left edge
            setShowLeftArrow(Math.round(lastRect.left) < Math.round(containerRect.left) - 5);
        } else {
            // In LTR, start is left, end is right.
            setShowLeftArrow(Math.round(firstRect.left) < Math.round(containerRect.left) - 5);
            setShowRightArrow(Math.round(lastRect.right) > Math.round(containerRect.right) + 5);
        }
    };

    useEffect(() => {
        handleScroll();
        window.addEventListener('resize', handleScroll);
        return () => window.removeEventListener('resize', handleScroll);
    }, [categories]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const isRtl = window.getComputedStyle(container).direction === 'rtl';
            
            // In RTL, left arrow means scrolling left (towards end, negative scrollLeft)
            // right arrow means scrolling right (towards start, scrollLeft towards 0)
            let scrollAmount = 0;
            if (isRtl) {
                scrollAmount = direction === 'left' ? -300 : 300;
            } else {
                scrollAmount = direction === 'left' ? -300 : 300;
            }
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (activeCategory && scrollContainerRef.current) {
            const activeEl = document.getElementById(`category-item-${activeCategory.slug}`);
            if (activeEl) {
                // Small timeout to allow Next.js route transition to finish
                setTimeout(() => {
                    activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }, 100);
            }
        }
    }, [activeCategory]);

    return (
        <div className="mb-10 relative">
            <div className="flex items-center justify-between mb-5 px-1">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl md:text-2xl font-bold text-[#1f1418] dark:text-white tracking-tight">
                        {t("products.browseCategories")}
                    </h2>
                    <span className="bg-primary/10 text-primary text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {categories.length} {t("admin.categories")}
                    </span>
                </div>
                
                {/* Desktop Nav Arrows */}
                <div className="hidden md:flex gap-2">
                    <button 
                        onClick={() => scroll('right')}
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1517] text-black dark:text-white disabled:opacity-0 disabled:pointer-events-none btn-curved-fill shadow-md transition-all"
                        disabled={!showRightArrow}
                    >
                        <MdChevronRight className="text-[22px]" />
                    </button>
                    <button 
                        onClick={() => scroll('left')}
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1517] text-black dark:text-white disabled:opacity-0 disabled:pointer-events-none btn-curved-fill shadow-md transition-all"
                        disabled={!showLeftArrow}
                    >
                        <MdChevronLeft className="text-[22px]" />
                    </button>
                </div>
            </div>

            <div className="relative group">
                <div 
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex overflow-x-auto hide-scrollbar gap-4 md:gap-6 py-4 px-2 scroll-smooth snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {/* All Products Card */}
                    <Link
                        href="/products"
                        className={`snap-start shrink-0 flex flex-col items-center gap-3 w-[85px] md:w-[100px] transition-all group/item ${!activeCategory ? 'scale-105' : ''}`}
                    >
                        <div className={`w-[75px] h-[75px] md:w-[90px] md:h-[90px] rounded-full flex items-center justify-center transition-all duration-300 ${!activeCategory ? 'bg-primary shadow-[0_8px_20px_-6px_rgba(230,118,174,0.6)] border-2 border-primary ring-4 ring-primary/20' : 'bg-[#FDFBF9] dark:bg-[#221d20] border border-[#ece2e5] dark:border-white/10 group-hover/item:border-primary/40 group-hover/item:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] group-hover/item:scale-105'}`}>
                            <MdGridView className={`text-[26px] md:text-[32px] ${!activeCategory ? 'text-white' : 'text-[#7b676f] dark:text-gray-400 group-hover/item:scale-110 transition-transform'}`} />
                        </div>
                        <span className={`text-[12px] md:text-[13px] font-bold text-center leading-tight ${!activeCategory ? 'text-primary' : 'text-[#2b1d21] dark:text-gray-300'}`}>
                            {t("products.allProducts")}
                        </span>
                    </Link>

                    {/* Category Cards */}
                    {categories.map((category) => {
                        const isActive = activeCategory?.slug === category.slug;
                        const defaultImage = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800';
                        const imageToUse = category.image || defaultImage;
                        
                        return (
                            <Link
                                key={category.id}
                                id={`category-item-${category.slug}`}
                                href={getCategoryHref(category.slug)}
                                className={`snap-start shrink-0 flex flex-col items-center gap-3 w-[85px] md:w-[100px] transition-all group/item ${isActive ? 'scale-105' : ''}`}
                            >
                                <div className={`w-[75px] h-[75px] md:w-[90px] md:h-[90px] rounded-full overflow-hidden flex items-center justify-center transition-all duration-300 relative ${isActive ? 'shadow-[0_8px_20px_-6px_rgba(230,118,174,0.6)] border-2 border-primary ring-4 ring-primary/20' : 'bg-[#FDFBF9] dark:bg-[#221d20] border border-[#ece2e5] dark:border-white/10 group-hover/item:border-primary/40 group-hover/item:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] group-hover/item:scale-105'}`}>
                                    <ResilientImage 
                                        src={imageToUse} 
                                        alt={category.name} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110"
                                    />
                                </div>
                                <span className={`text-[12px] md:text-[13px] font-bold text-center leading-tight line-clamp-2 ${isActive ? 'text-primary' : 'text-[#2b1d21] dark:text-gray-300'}`}>
                                    {category.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* Gradient Fades for Scroll Indicators */}
                <div className={`absolute top-0 bottom-6 left-0 w-12 bg-gradient-to-r from-[#fafafa] dark:from-[#111111] to-transparent pointer-events-none transition-opacity duration-300 ${showLeftArrow ? 'opacity-100' : 'opacity-0'}`}></div>
                <div className={`absolute top-0 bottom-6 right-0 w-12 bg-gradient-to-l from-[#fafafa] dark:from-[#111111] to-transparent pointer-events-none transition-opacity duration-300 ${showRightArrow ? 'opacity-100' : 'opacity-0'}`}></div>
            </div>
        </div>
    );
};

export default CategorySelector;
