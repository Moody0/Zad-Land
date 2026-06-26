"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import { MdChevronRight } from 'react-icons/md';

interface ProductsBreadcrumbsProps {
    activeCategory?: {
        name: string;
    } | null;
}

const ProductsBreadcrumbs = ({ activeCategory = null }: ProductsBreadcrumbsProps) => {
    const { t } = useLanguage();

    return (
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
            <Link className="font-medium text-gray-500 hover-underline-animated transition-colors" href="/">{t('common.home')}</Link>
            <MdChevronRight className="text-[16px] text-gray-400 rtl:rotate-180" />
            {!activeCategory ? (
                <span className="font-bold text-primary">{t('common.shop')}</span>
            ) : (
                <>
                    <Link className="font-medium text-gray-500 hover-underline-animated transition-colors" href="/products">
                        {t('common.shop')}
                    </Link>
                    <MdChevronRight className="text-[16px] text-gray-400 rtl:rotate-180" />
                    <span className="font-bold text-primary">{activeCategory.name}</span>
                </>
            )}
        </div>
    );
};

export default ProductsBreadcrumbs;

