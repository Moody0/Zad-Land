"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import {
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdAdd
} from 'react-icons/md';
import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';

interface MobileCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    brandId?: string;
    brand?: {
        id: string;
        name: string;
        slug: string;
        group: string;
    } | null;
}

interface NavBrand {
    id: string;
    name: string;
    slug: string;
}

interface NavCategory {
    id: string;
    name: string;
    slug: string;
}

interface NavMainCategory {
    id: string;
    name: string;
    slug: string;
    brands: NavBrand[];
    categories: NavCategory[];
}

interface MobileMenuProps {
    initialCategories: MobileCategory[];
    isOpen?: boolean;
    setIsOpen?: (open: boolean) => void;
    isSearchOpen?: boolean;
    setIsSearchOpen?: (open: boolean) => void;
    hideTriggers?: boolean;
}

const MobileMenu = ({
    initialCategories,
    isOpen: externalIsOpen,
    setIsOpen: externalSetIsOpen,
    hideTriggers = false
}: MobileMenuProps) => {
    const { t, dir, language } = useLanguage();

    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const isMobileMenuOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
    const setIsMobileMenuOpen = externalSetIsOpen !== undefined ? externalSetIsOpen : setInternalIsOpen;

    const [navData, setNavData] = useState<NavMainCategory[]>([]);
    const [activeMainCatSlug, setActiveMainCatSlug] = useState<string | null>(null);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);
    const [shouldRender, setShouldRender] = useState(isMobileMenuOpen);
    const [isAnimating, setIsAnimating] = useState(false);

    // Fetch nav data
    useEffect(() => {
        fetch('/api/navigation')
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setNavData(data);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            setShouldRender(true);
            const timer = setTimeout(() => setIsAnimating(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsAnimating(false);
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isMobileMenuOpen]);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    const activeMainCat = navData.find((mc) => mc.slug === activeMainCatSlug);

    if (!shouldRender) return null;

    return (
        <div className={`fixed top-[140px] left-0 right-0 bottom-0 z-[40] md:hidden transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} suppressHydrationWarning>
            <div
                className={`absolute top-0 inset-x-0 bottom-0 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sidebar Content */}
            <div className={`absolute top-0 left-0 right-0 bottom-0 w-full bg-white dark:bg-surface-dark shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${isAnimating ? 'translate-x-0' : 'translate-x-full'} overflow-hidden`}>

                {/* Navigation Container (Sliding Views) */}
                <div className="flex-1 relative overflow-hidden">

                    {/* Main Menu View */}
                    <div className={`absolute inset-0 transition-transform duration-300 ease-in-out ${activeMainCatSlug ? '-translate-x-full' : 'translate-x-0'}`}>
                        <div className="flex flex-col h-full overflow-y-auto px-2 pt-4">


                            {/* Dynamic Main Categories */}
                            {navData.map((mc) => (
                                <div key={mc.id} className="border-b border-gray-50/50 dark:border-white/5">
                                    <button
                                        onClick={() => setActiveMainCatSlug(mc.slug)}
                                        className="w-full flex items-center justify-between py-4 px-4"
                                    >
                                        <span className="text-[16px] font-semibold text-[rgb(46,46,46)] dark:text-white">
                                            {mc.name}
                                        </span>
                                        <MdKeyboardArrowLeft className="text-2xl text-[rgb(46,46,46)] dark:text-white" />
                                    </button>
                                </div>
                            ))}



                            {/* About Us */}
                            <div className="border-b border-gray-50/50 dark:border-white/5">
                                <Link
                                    href="/about-us"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between py-4 px-4 group"
                                >
                                    <span className="text-[16px] font-semibold text-[rgb(46,46,46)] dark:text-white">
                                        {language === 'ar' ? 'عن الشركة' : 'About Us'}
                                    </span>
                                </Link>
                            </div>

                            {/* Social Footer */}
                            <div className="p-8 flex items-center justify-start gap-6 mt-auto">
                                <a href="https://wa.me/963933254796" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <FaWhatsapp className="text-xl" />
                                </a>
                                <a href="https://www.instagram.com/ruby.beauty.sy" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <FaInstagram className="text-xl" />
                                </a>
                                <a href="https://www.facebook.com/share/1HzXdo7sLG/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <FaFacebook className="text-xl" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Sub Menu View (Main Category Detail) */}
                    <div className={`absolute inset-0 transition-transform duration-300 ease-in-out ${activeMainCatSlug ? 'translate-x-0' : 'translate-x-full'}`}>
                        {activeMainCat && (
                            <div className="flex flex-col h-full bg-white dark:bg-surface-dark">
                                {/* Back Button Header */}
                                <div className="border-b border-gray-100 dark:border-white/10 px-4 py-4 flex items-center justify-between">
                                    <button
                                        onClick={() => { setActiveMainCatSlug(null); setExpandedSection(null); }}
                                        className="flex items-center gap-2 text-[rgb(46,46,46)] dark:text-white hover:text-black transition-colors"
                                    >
                                        <MdKeyboardArrowRight className="text-2xl" />
                                        <span className="text-[16px] font-medium">{activeMainCat.name}</span>
                                    </button>
                                    <Link
                                        href={`/department/${activeMainCat.slug}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-[13px] font-semibold text-[#1C1C1C] dark:text-white underline"
                                    >
                                        {language === 'ar' ? 'عرض الكل' : 'View All'}
                                    </Link>
                                </div>

                                {/* Accordion Sections */}
                                <div className="flex-1 overflow-y-auto px-2">
                                    <div className="flex flex-col pt-2">

                                        {/* Brands Section */}
                                        {activeMainCat.brands.length > 0 && (
                                            <div className="border-b border-gray-100/60 dark:border-white/5">
                                                <button
                                                    onClick={() => setExpandedSection(expandedSection === 'brands' ? null : 'brands')}
                                                    className="w-full flex items-center justify-between py-4 px-4 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
                                                >
                                                    <span className="text-[15px] font-bold text-[#1C1C1C] dark:text-white uppercase tracking-wider">
                                                        {language === 'ar' ? 'الماركات' : 'Brands'}
                                                    </span>
                                                    <MdAdd className={`text-2xl text-[rgb(46,46,46)] dark:text-white transition-transform duration-300 ${expandedSection === 'brands' ? 'rotate-45 text-black dark:text-white' : ''}`} />
                                                </button>
                                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSection === 'brands' ? 'max-h-[500px] border-t border-gray-100/50 dark:border-white/5 bg-gray-50/45 dark:bg-white/5' : 'max-h-0'}`}>
                                                    <div className="py-2 px-6 flex flex-col gap-1">
                                                        {activeMainCat.brands.map((brand) => (
                                                            <Link
                                                                key={brand.id}
                                                                href={`/brands/${brand.slug}`}
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                                className="flex items-center py-3 text-[15px] font-medium text-[rgb(46,46,46)] dark:text-gray-300 hover:text-black dark:hover:text-white border-b border-gray-100/50 dark:border-white/5 last:border-b-0 transition-colors"
                                                            >
                                                                {brand.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Categories Section */}
                                        {activeMainCat.categories.length > 0 && (
                                            <div className="border-b border-gray-100/60 dark:border-white/5">
                                                <button
                                                    onClick={() => setExpandedSection(expandedSection === 'categories' ? null : 'categories')}
                                                    className="w-full flex items-center justify-between py-4 px-4 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
                                                >
                                                    <span className="text-[15px] font-bold text-[#1C1C1C] dark:text-white uppercase tracking-wider">
                                                        {language === 'ar' ? 'الأقسام' : 'Categories'}
                                                    </span>
                                                    <MdAdd className={`text-2xl text-[rgb(46,46,46)] dark:text-white transition-transform duration-300 ${expandedSection === 'categories' ? 'rotate-45 text-black dark:text-white' : ''}`} />
                                                </button>
                                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSection === 'categories' ? 'max-h-[500px] border-t border-gray-100/50 dark:border-white/5 bg-gray-50/45 dark:bg-white/5' : 'max-h-0'}`}>
                                                    <div className="py-2 px-6 flex flex-col gap-1">
                                                        {activeMainCat.categories.map((cat) => (
                                                            <Link
                                                                key={cat.id}
                                                                href={`/categories/${cat.slug}`}
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                                className="flex items-center py-3 text-[15px] font-medium text-[rgb(46,46,46)] dark:text-gray-300 hover:text-black dark:hover:text-white border-b border-gray-100/50 dark:border-white/5 last:border-b-0 transition-colors"
                                                            >
                                                                {cat.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MobileMenu;
