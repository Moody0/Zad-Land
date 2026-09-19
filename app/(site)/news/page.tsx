import React from 'react';
import { Metadata } from 'next';
import { getI18n } from '@/lib/i18n';
import NewsClient from './NewsClient';

export const metadata: Metadata = {
    title: 'الأخبار والمستجدات | Latest News & Wholesale Supply Updates - Zad Land',
    description: 'تابع آخر أخبار شركة زاد لاند لتجارة وتوزيع المواد الغذائية بالجملة، وصول الشحنات الجديدة، والشراكات الحصرية مع كبرى المصانع العالمية.',
    alternates: {
        canonical: '/news',
    },
    openGraph: {
        title: 'أخبار شركة زاد لاند | Zad Land News',
        description: 'آخر أخبار التوريد وتوزيع البضائع والمستجدات التجارية لدى شركة زاد لاند.',
        url: '/news',
    },
};

export default async function NewsPage() {
    const { language, dir } = await getI18n();

    return <NewsClient language={language} dir={dir} />;
}
