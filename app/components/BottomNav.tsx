'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import { MdHome } from 'react-icons/md';
import { LuLayoutGrid, LuHandshake, LuPhone } from 'react-icons/lu';
import { IoNewspaperOutline } from 'react-icons/io5';

const BottomNav = () => {
    const { language } = useLanguage();
    const pathname = usePathname();
    const isAr = language === 'ar';

    const navItems = [
        {
            href: '/',
            label: isAr ? 'الرئيسية' : 'Home',
            icon: MdHome,
            iconClass: 'text-[24px]',
            isActive: pathname === '/',
        },
        {
            href: '/products',
            label: isAr ? 'المنتجات' : 'Products',
            icon: LuLayoutGrid,
            iconClass: 'text-[21px] stroke-[2.2]',
            isActive: pathname === '/products' || pathname.startsWith('/products/') || pathname === '/categories' || pathname.startsWith('/categories/') || pathname.startsWith('/department/'),
        },
        {
            href: '/brands',
            label: isAr ? 'شركاؤنا' : 'Partners',
            icon: LuHandshake,
            iconClass: 'text-[23px] stroke-[2]',
            isActive: pathname === '/brands' || pathname.startsWith('/brands/'),
        },
        {
            href: '/news',
            label: isAr ? 'الأخبار' : 'News',
            icon: IoNewspaperOutline,
            iconClass: 'text-[22px]',
            isActive: pathname === '/news' || pathname.startsWith('/news/'),
        },
        {
            href: '/contact',
            label: isAr ? 'تواصل معنا' : 'Contact Us',
            icon: LuPhone,
            iconClass: 'text-[20px] stroke-[2.2]',
            isActive: pathname === '/contact' || pathname.startsWith('/contact/'),
        },
    ];

    return (
        <nav
            aria-label="Mobile Navigation Bar"
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#1A1A14] border-t border-gray-150 dark:border-white/10 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]"
        >
            <div
                dir="ltr"
                className="grid grid-cols-5 w-full pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] px-1"
            >
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = item.isActive;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-col items-center justify-center gap-0.5 py-0.5 transition-all group active:scale-95 text-center"
                        >
                            <div className="flex items-center justify-center h-[26px]">
                                <Icon
                                    className={`transition-colors duration-200 ${item.iconClass} ${
                                        active
                                            ? 'text-[#B8860B] dark:text-[#E5B54A]'
                                            : 'text-[#4A5568] dark:text-[#9CA3AF] group-hover:text-black dark:group-hover:text-white'
                                    }`}
                                />
                            </div>
                            <span
                                className={`text-[11px] leading-tight font-medium tracking-tight transition-colors duration-200 ${
                                    active
                                        ? 'text-[#B8860B] dark:text-[#E5B54A] font-semibold'
                                        : 'text-[#4A5568] dark:text-[#9CA3AF] group-hover:text-black dark:group-hover:text-white'
                                }`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
