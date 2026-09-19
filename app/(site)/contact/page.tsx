import React from 'react';
import { Metadata } from 'next';
import { getI18n } from '@/lib/i18n';
import { getSiteSettings } from '@/lib/admin-actions';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
    title: 'تواصل معنا | Contact Zad Land - زاد لاند لتجارة وتوزيع المواد الغذائية بالجملة',
    description: 'تواصل مع فريق مبيعات وتوزيع شركة زاد لاند. استفسارات طلبات الجملة، عقود التوريد التجاري، وخدمة العملاء في كافة المحافظات.',
    alternates: {
        canonical: '/contact',
    },
    openGraph: {
        title: 'تواصل مع زاد لاند | Contact Zad Land',
        description: 'تواصل مع فريق المبيعات والتوريد التجاري بالجملة لدى شركة زاد لاند.',
        url: '/contact',
    },
};

export default async function ContactPage() {
    const [{ language, dir }, settings] = await Promise.all([
        getI18n(),
        getSiteSettings(),
    ]);

    return (
        <ContactClient
            language={language}
            dir={dir}
            settings={settings}
        />
    );
}
