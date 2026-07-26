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
            href: settings?.footerInstagramUrl || "https://www.instagram.com/ruby.beauty.sy",
            icon: FaInstagram,
            label: "Instagram",
        },
        {
            href: settings?.footerFacebookUrl || "https://www.facebook.com/share/1HzXdo7sLG/?mibextid=wwXIfr",
            icon: FaFacebook,
            label: "Facebook",
        },
        {
            href: settings?.footerWhatsappUrl || "https://wa.me/963933254796",
            icon: FaWhatsapp,
            label: "WhatsApp",
        },
    ].filter((link) => link.href);

    const renderNavLink = (label: string, href: string) => {
        if (isExternalUrl(href)) {
            return (
                <a className="hover:text-zinc-900 dark:hover:text-white transition-colors" href={href} target="_blank" rel="noopener noreferrer">
                    {label}
                </a>
            );
        }

        return (
            <Link className="hover:text-zinc-900 dark:hover:text-white transition-colors" href={href}>
                {label}
            </Link>
        );
    };

    return (
        <footer className="bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-white/10 pt-14 pb-8">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <h4 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">{brandTitle}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
                            {brandDescription}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        className="w-9 h-9 rounded-full bg-gray-100 dark:bg-zinc-800 text-zinc-900 dark:text-gray-300 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all flex items-center justify-center text-sm"
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                    >
                                        <Icon />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div className="flex flex-col gap-4">
                        <h5 className="font-extrabold text-sm text-zinc-900 dark:text-white uppercase tracking-wider">{shopTitle}</h5>
                        <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                            {footerCategories.length > 0 ? (
                                footerCategories.map((category) => (
                                    <li key={category.id}>
                                        <Link className="hover:text-zinc-900 dark:hover:text-white transition-colors" href={`/categories/${category.slug}`}>
                                            {category.name}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li>
                                    <Link className="hover:text-zinc-900 dark:hover:text-white transition-colors" href="/products">
                                        {t('products.allProducts')}
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="flex flex-col gap-4">
                        <h5 className="font-extrabold text-sm text-zinc-900 dark:text-white uppercase tracking-wider">{supportTitle}</h5>
                        <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                            {supportLinks.map((link) => (
                                <li key={`${link.label}-${link.url}`}>
                                    {renderNavLink(link.label, link.url)}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div className="flex flex-col gap-4">
                        <h5 className="font-extrabold text-sm text-zinc-900 dark:text-white uppercase tracking-wider">{companyTitle}</h5>
                        <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                            {companyLinks.map((link) => (
                                <li key={`${link.label}-${link.url}`}>
                                    {renderNavLink(link.label, link.url)}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Line */}
                <div className="border-t border-gray-200 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-400">
                    <p>{copyright}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
