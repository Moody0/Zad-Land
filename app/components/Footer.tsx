import Link from 'next/link';
import React from 'react';
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { getFooterCategories } from '@/lib/catalog';
import { getSiteSettings } from '@/lib/admin-actions';

interface FooterProps {
    t: (key: string) => string;
    language: string;
}

function isExternalUrl(url: string) {
    return /^(https?:\/\/|mailto:|tel:)/i.test(url);
}

function getLocalizedValue(language: string, englishValue?: string | null, arabicValue?: string | null) {
    if (language === 'ar') {
        return arabicValue || englishValue || "";
    }

    return englishValue || arabicValue || "";
}

const Footer = async ({ t, language }: FooterProps) => {
    const settings = await getSiteSettings();
    const footerCategories = await getFooterCategories([
        settings?.footerCategory1Id || "",
        settings?.footerCategory2Id || "",
        settings?.footerCategory3Id || "",
        settings?.footerCategory4Id || "",
    ]);

    const brandTitle = getLocalizedValue(language, settings?.footerBrandTitle, settings?.footerBrandTitleAr) || t('header.brandName');
    const brandDescription = getLocalizedValue(language, settings?.footerBrandDescription, settings?.footerBrandDescriptionAr) || t('footer.brandDescription');
    const copyright = getLocalizedValue(language, settings?.footerCopyright, settings?.footerCopyrightAr) || t('footer.copyright');
    const shopTitle = getLocalizedValue(language, settings?.footerShopTitle, settings?.footerShopTitleAr) || t('footer.shop');
    const supportTitle = getLocalizedValue(language, settings?.footerSupportTitle, settings?.footerSupportTitleAr) || t('footer.support');
    const companyTitle = getLocalizedValue(language, settings?.footerCompanyTitle, settings?.footerCompanyTitleAr) || t('footer.company');

    const supportLinks = [
        {
            label: getLocalizedValue(language, settings?.footerSupportLink1Label, settings?.footerSupportLink1LabelAr),
            url: settings?.footerSupportLink1Url || "",
        },
        {
            label: getLocalizedValue(language, settings?.footerSupportLink2Label, settings?.footerSupportLink2LabelAr),
            url: settings?.footerSupportLink2Url || "",
        },
        {
            label: getLocalizedValue(language, settings?.footerSupportLink3Label, settings?.footerSupportLink3LabelAr),
            url: settings?.footerSupportLink3Url || "",
        },
    ].filter((link) => link.label && link.url);

    const companyLinks = [
        {
            label: getLocalizedValue(language, settings?.footerCompanyLink1Label, settings?.footerCompanyLink1LabelAr),
            url: settings?.footerCompanyLink1Url || "",
        },
        {
            label: getLocalizedValue(language, settings?.footerCompanyLink2Label, settings?.footerCompanyLink2LabelAr),
            url: settings?.footerCompanyLink2Url || "",
        },
        {
            label: getLocalizedValue(language, settings?.footerCompanyLink3Label, settings?.footerCompanyLink3LabelAr),
            url: settings?.footerCompanyLink3Url || "",
        },
    ].filter((link) => link.label && link.url);

    const socialLinks = [
        {
            href: settings?.footerInstagramUrl || "",
            icon: FaInstagram,
            label: "Instagram",
        },
        {
            href: settings?.footerFacebookUrl || "",
            icon: FaFacebook,
            label: "Facebook",
        },
        {
            href: settings?.footerWhatsappUrl || "",
            icon: FaWhatsapp,
            label: "WhatsApp",
        },
    ].filter((link) => link.href);

    const renderNavLink = (label: string, href: string) => {
        if (isExternalUrl(href)) {
            return (
                <a className="hover-underline-animated transition-colors" href={href} target="_blank" rel="noopener noreferrer">
                    {label}
                </a>
            );
        }

        return (
            <Link className="hover-underline-animated transition-colors" href={href}>
                {label}
            </Link>
        );
    };

    return (
        <footer
            className="bg-surface-light dark:bg-surface-dark border-t border-[#f4f0f2] dark:border-[#3a1d26] pt-16 pb-8"
        >
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <h4 className="text-xl font-bold text-text-main-light dark:text-text-main-dark">{brandTitle}</h4>
                        </div>
                        <p className="text-text-muted-light dark:text-text-muted-dark max-w-xs leading-relaxed">
                            {brandDescription}
                        </p>
                        <div className="flex gap-4 text-2xl mt-2">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        className="text-text-muted-light dark:text-text-muted-dark hover-underline-animated transition-colors"
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <span className="sr-only">{social.label}</span>
                                        <Icon />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h5 className="font-bold text-text-main-light dark:text-text-main-dark">{shopTitle}</h5>
                        <ul className="flex flex-col gap-2.5 text-sm text-text-muted-light dark:text-text-muted-dark">
                            {footerCategories.length > 0 ? (
                                footerCategories.map((category) => (
                                    <li key={category.id}>
                                        <Link className="hover-underline-animated transition-colors" href={`/categories/${category.slug}`}>
                                            {category.name}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li>
                                    <Link className="hover-underline-animated transition-colors" href="/products">
                                        {t('products.allProducts')}
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h5 className="font-bold text-text-main-light dark:text-text-main-dark">{supportTitle}</h5>
                        <ul className="flex flex-col gap-2.5 text-sm text-text-muted-light dark:text-text-muted-dark">
                            {supportLinks.map((link) => (
                                <li key={`${link.label}-${link.url}`}>
                                    {renderNavLink(link.label, link.url)}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h5 className="font-bold text-text-main-light dark:text-text-main-dark">{companyTitle}</h5>
                        <ul className="flex flex-col gap-2.5 text-sm text-text-muted-light dark:text-text-muted-dark">
                            {companyLinks.map((link) => (
                                <li key={`${link.label}-${link.url}`}>
                                    {renderNavLink(link.label, link.url)}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-[#f4f0f2] dark:border-[#3a1d26] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-muted-light dark:text-text-muted-dark">
                    <p>{copyright}</p>

                </div>
            </div>
        </footer>
    );
};

export default Footer;

