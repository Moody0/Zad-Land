'use client';

import Link from 'next/link';
import React from 'react';
import { MdOutlineShoppingBag, MdMenu, MdClose, MdKeyboardArrowDown } from 'react-icons/md';
import { useLanguage } from '@/app/context/LanguageContext';
import { useCart } from '@/app/context/CartContext';
import HeaderSearch from './HeaderSearch';
import MobileMenu from './MobileMenu';
import CurrencyToggle from './CurrencyToggle';
import LanguageToggle from './LanguageToggle';
import MegaMenu, { type NavMainCategory } from './HeaderComponents/MegaMenu';
import { AnimatePresence } from 'framer-motion';
import TopBar from './HeaderComponents/TopBar';

interface HeaderCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
}

interface HeaderProps {
    initialCategories?: HeaderCategory[];
    dir: 'ltr' | 'rtl';
    language: 'en' | 'ar';
}

const Header = ({ initialCategories = [], dir }: HeaderProps) => {
    const { totalItems, openDrawer } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [manualToggle, setManualToggle] = React.useState(false);
    const isNavVisible = !isScrolled || manualToggle;
    const isScrolledRef = React.useRef(false);

    // Mega menu state
    const [navData, setNavData] = React.useState<NavMainCategory[]>([]);
    const [activeMegaMenu, setActiveMegaMenu] = React.useState<string | null>(null);
    const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    // Fetch navigation data on mount
    React.useEffect(() => {
        fetch('/api/navigation')
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setNavData(data);
            })
            .catch(() => {});
    }, []);

    React.useEffect(() => {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateScroll = () => {
            const currentScrollY = window.scrollY;
            
            // If we are at the very top, always show navbar
            if (currentScrollY <= 10) {
                if (isScrolledRef.current) {
                    isScrolledRef.current = false;
                    setIsScrolled(false);
                    setManualToggle(false);
                }
                ticking = false;
                return;
            }

            // Collapse the header immediately upon scrolling past 10px
            if (currentScrollY > 10) {
                if (!isScrolledRef.current) {
                    isScrolledRef.current = true;
                    setIsScrolled(true);
                }
            }

            lastScrollY = currentScrollY;
            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateScroll);
                ticking = true;
            }
        };

        // Initialize state on mount
        updateScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavEnter = (slug: string) => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        setActiveMegaMenu(slug);
    };

    const handleNavLeave = () => {
        closeTimeoutRef.current = setTimeout(() => {
            setActiveMegaMenu(null);
        }, 150);
    };

    const handleMegaMenuClose = () => {
        setActiveMegaMenu(null);
    };

    const activeNavData = navData.find((mc) => mc.slug === activeMegaMenu);

    return (
        <>
            {/* Spacer to prevent layout shift when header collapses */}
            <div className="w-full h-[140px] md:h-[126px] lg:h-[158px]" aria-hidden="true" />

            <header className="fixed top-0 left-0 z-50 w-full bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-white/10 transition-all duration-300">
                {/* Disappearing Top Bar */}
                <TopBar isVisible={!isScrolled} />
                
                <div className="container-custom">
                    {/* Main Header Row */}
                    <div className="py-4 md:py-[11px] h-auto md:h-[70px] flex flex-col md:flex-row md:items-center relative">
                        {/* Desktop Version */}
                        <div className="hidden md:flex items-center justify-between gap-6 w-full">
                            {/* Left: Logo and Menu Toggle Group */}
                            <div className="flex items-center shrink-0">
                                <button
                                    onClick={() => setManualToggle(prev => !prev)}
                                    className={`flex items-center justify-center transition-all duration-500 ease-in-out h-10 overflow-hidden text-zinc-900 dark:text-white ${isScrolled ? 'w-10 opacity-100' : 'w-0 opacity-0 pointer-events-none'
                                        }`}
                                >
                                    <div className="w-5 h-5 flex flex-col items-center justify-center gap-[4px]">
                                        <span className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${isNavVisible && isScrolled ? 'translate-y-[6px] rotate-45' : ''
                                            }`} />
                                        <span className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${isNavVisible && isScrolled ? 'opacity-0 scale-0' : ''
                                            }`} />
                                        <span className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${isNavVisible && isScrolled ? '-translate-y-[6px] -rotate-45' : ''
                                            }`} />
                                    </div>
                                </button>

                                <div className={`transition-all duration-500 ease-in-out ${isScrolled ? 'ms-2' : 'ms-0'}`}>
                                    <Link href="/" className="flex flex-col items-center">
                                        <span className="text-[28px] leading-none font-extrabold tracking-tight text-zinc-900 dark:text-white">
                                            Ruby Beauty
                                        </span>
                                        <span className={`font-medium leading-none transition-all duration-300 ${dir === 'rtl'
                                            ? 'text-[13px] tracking-normal mt-[2px] font-semibold text-zinc-900 dark:text-white'
                                            : 'text-[10px] tracking-[0.2em] uppercase mt-[2px] text-gray-500 dark:text-white/70'
                                            }`}>
                                            {dir === 'rtl' ? 'جـمــالــك يـلـيــق بــك' : 'Your beauty deserves it'}
                                        </span>
                                    </Link>
                                </div>
                            </div>

                            {/* Center: Search */}
                            <div className="flex-1 max-w-3xl px-4">
                                <HeaderSearch />
                            </div>

                            {/* Right: Cart Button Drawer Trigger */}
                            <div className="flex items-center gap-3 md:gap-5 shrink-0">
                                <button
                                    onClick={openDrawer}
                                    className="w-11 h-11 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-xl text-zinc-900 dark:text-white hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all relative"
                                    aria-label="Open Shopping Cart"
                                >
                                    <MdOutlineShoppingBag />
                                    {totalItems > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-[#C20059] text-white text-[10px] font-extrabold w-4.5 h-4.5 flex items-center justify-center rounded-full shadow-sm">
                                            {totalItems}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Mobile Version */}
                        <div className="flex md:hidden flex-col gap-4">
                            {/* Top Row: Menu, Logo, Controls, Cart Drawer Trigger */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                        className="p-1 text-zinc-900 dark:text-white"
                                    >
                                        {isMobileMenuOpen ? (
                                            <MdClose className="text-3xl" />
                                        ) : (
                                            <MdMenu className="text-3xl" />
                                        )}
                                    </button>
                                    <Link href="/" className="flex flex-col items-center">
                                        <span className="text-[19.6px] leading-none font-bold tracking-tight text-zinc-900 dark:text-white uppercase">
                                            Ruby Beauty
                                        </span>
                                        <span className={`font-medium leading-none transition-all duration-300 ${dir === 'rtl'
                                            ? 'text-[11px] tracking-normal mt-[4px] font-semibold text-zinc-900 dark:text-white'
                                            : 'text-[9px] tracking-[0.1em] uppercase mt-[4px] text-gray-500 dark:text-white/70'
                                            }`}>
                                            {dir === 'rtl' ? 'جـمــالــك يـلـيــق بــك' : 'Your beauty deserves it'}
                                        </span>
                                    </Link>
                                </div>

                                <div className="flex items-center gap-2">
                                    <LanguageToggle />
                                    <CurrencyToggle />
                                    <button
                                        onClick={openDrawer}
                                        className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-lg text-zinc-900 dark:text-white relative"
                                        aria-label="Open Shopping Cart"
                                    >
                                        <MdOutlineShoppingBag />
                                        {totalItems > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-[#C20059] text-white text-[10px] font-extrabold w-4 h-4 flex items-center justify-center rounded-full">
                                                {totalItems}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Bottom Row: Search Bar */}
                            <div className="w-full">
                                <HeaderSearch autoFocus={false} />
                            </div>
                        </div>

                        {/* Mobile Overlays Wrapper */}
                        <MobileMenu
                            initialCategories={initialCategories}
                            isOpen={isMobileMenuOpen}
                            setIsOpen={setIsMobileMenuOpen}
                            isSearchOpen={isMobileSearchOpen}
                            setIsSearchOpen={setIsMobileSearchOpen}
                            hideTriggers={true}
                        />
                    </div>
                </div>

                {/* Navigation Links Row - Desktop only */}
                <nav
                    className={`hidden md:grid bg-[#F1F1F1] dark:bg-zinc-800/60 border-t border-gray-100 dark:border-white/5 transition-all duration-300 ease-in-out relative ${!isNavVisible ? 'grid-rows-[0fr] opacity-0 border-t-0' : 'grid-rows-[1fr] opacity-100'
                        }`}
                >
                    <div className="overflow-hidden">
                        <div className="container-custom">
                            <div className="flex items-center justify-center gap-8 h-[56px]">
                                {navData.map((mc) => (
                                    <div
                                        key={mc.id}
                                        className="relative"
                                        onMouseEnter={() => handleNavEnter(mc.slug)}
                                        onMouseLeave={handleNavLeave}
                                    >
                                        <Link
                                            href={`/department/${mc.slug}`}
                                            className={`text-[15px] font-semibold relative flex items-center gap-1 transition-colors ${
                                                activeMegaMenu === mc.slug
                                                    ? 'text-black dark:text-white'
                                                    : 'text-zinc-900 dark:text-white/90 hover:text-black dark:hover:text-white'
                                            }`}
                                        >
                                            <span>{mc.name}</span>
                                            <MdKeyboardArrowDown className={`text-lg transition-transform duration-300 ${activeMegaMenu === mc.slug ? 'rotate-180' : ''}`} />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Mega Menu Dropdown */}
                    <AnimatePresence>
                        {activeMegaMenu && activeNavData && (
                            <MegaMenu
                                key={activeMegaMenu}
                                data={activeNavData}
                                onClose={handleMegaMenuClose}
                                onMouseEnter={() => {
                                    if (closeTimeoutRef.current) {
                                        clearTimeout(closeTimeoutRef.current);
                                        closeTimeoutRef.current = null;
                                    }
                                }}
                                onMouseLeave={handleNavLeave}
                            />
                        )}
                    </AnimatePresence>
                </nav>
            </header>
        </>
    );
};

export default Header;
