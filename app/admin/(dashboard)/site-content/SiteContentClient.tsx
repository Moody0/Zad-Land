"use client";

import { useState } from "react";
import { MdImage, MdImageNotSupported, MdSchedule, MdLocalShipping, MdWarning, MdCleanHands, MdAssignmentReturn, MdVerified } from "react-icons/md";
import AdminHeader from "../../components/AdminHeader";
import { useAdminSidebar } from "../../context/AdminSidebarContext";
import { updateSiteSettings } from "../../../../lib/admin-actions";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/app/context/LanguageContext";
import FooterContentSection from "./FooterContentSection";

interface FooterCategoryOption {
    id: string;
    name: string;
}

interface SiteSettings {
    id: string;
    categoriesCtaTitle: string | null;
    categoriesCtaDesc: string | null;
    categoriesCtaTitleAr: string | null;
    categoriesCtaDescAr: string | null;
    categoriesCtaImage: string | null;
    footerBrandTitle: string | null;
    footerBrandTitleAr: string | null;
    footerBrandDescription: string | null;
    footerBrandDescriptionAr: string | null;
    footerCopyright: string | null;
    footerCopyrightAr: string | null;
    footerInstagramUrl: string | null;
    footerFacebookUrl: string | null;
    footerWhatsappUrl: string | null;
    footerShopTitle: string | null;
    footerShopTitleAr: string | null;
    footerSupportTitle: string | null;
    footerSupportTitleAr: string | null;
    footerCompanyTitle: string | null;
    footerCompanyTitleAr: string | null;
    footerSupportLink1Label: string | null;
    footerSupportLink1LabelAr: string | null;
    footerSupportLink1Url: string | null;
    footerSupportLink2Label: string | null;
    footerSupportLink2LabelAr: string | null;
    footerSupportLink2Url: string | null;
    footerSupportLink3Label: string | null;
    footerSupportLink3LabelAr: string | null;
    footerSupportLink3Url: string | null;
    footerCompanyLink1Label: string | null;
    footerCompanyLink1LabelAr: string | null;
    footerCompanyLink1Url: string | null;
    footerCompanyLink2Label: string | null;
    footerCompanyLink2LabelAr: string | null;
    footerCompanyLink2Url: string | null;
    footerCompanyLink3Label: string | null;
    footerCompanyLink3LabelAr: string | null;
    footerCompanyLink3Url: string | null;
    footerCategory1Id: string | null;
    footerCategory2Id: string | null;
    footerCategory3Id: string | null;
    footerCategory4Id: string | null;
    shippingTitle: string | null;
    shippingDesc: string | null;
    shippingTitleAr: string | null;
    shippingDescAr: string | null;
    verificationTitle: string | null;
    verificationDesc: string | null;
    verificationTitleAr: string | null;
    verificationDescAr: string | null;
    standardShippingTime: string | null;
    expressShippingTime: string | null;
    returnsTitle: string | null;
    returnsDesc: string | null;
    returnsTitleAr: string | null;
    returnsDescAr: string | null;
    finalSaleTitle: string | null;
    finalSaleDesc: string | null;
    finalSaleTitleAr: string | null;
    finalSaleDescAr: string | null;
    hygieneTitle: string | null;
    hygieneDesc: string | null;
    hygieneTitleAr: string | null;
    hygieneDescAr: string | null;
    shippingReturnsImage: string | null;
    aboutHeroTitle: string | null;
    aboutHeroTitleAr: string | null;
    aboutHeroSubtitle: string | null;
    aboutHeroSubtitleAr: string | null;
    aboutHeroImage: string | null;
    aboutNarrativeTitle: string | null;
    aboutNarrativeTitleAr: string | null;
    aboutNarrativeFounded: string | null;
    aboutNarrativeFoundedAr: string | null;
    aboutNarrativeDesc1: string | null;
    aboutNarrativeDesc1Ar: string | null;
    aboutNarrativeDesc2: string | null;
    aboutNarrativeDesc2Ar: string | null;
    aboutNarrativeQuote: string | null;
    aboutNarrativeQuoteAr: string | null;
    aboutNarrativeImage: string | null;
    aboutValuesTitle: string | null;
    aboutValuesTitleAr: string | null;
    aboutValuesDesc: string | null;
    aboutValuesDescAr: string | null;
    aboutValue1Title: string | null;
    aboutValue1TitleAr: string | null;
    aboutValue1Desc: string | null;
    aboutValue1DescAr: string | null;
    aboutValue2Title: string | null;
    aboutValue2TitleAr: string | null;
    aboutValue2Desc: string | null;
    aboutValue2DescAr: string | null;
    aboutValue3Title: string | null;
    aboutValue3TitleAr: string | null;
    aboutValue3Desc: string | null;
    aboutValue3DescAr: string | null;
    middleBanner1Image: string | null;
    middleBanner1Link: string | null;
    middleBanner2Image: string | null;
    middleBanner2Link: string | null;
    middleBanner2Title: string | null;
    middleBanner2TitleAr: string | null;
    middleBanner2Subtitle: string | null;
    middleBanner2SubtitleAr: string | null;
    middleBanner2ButtonText: string | null;
    middleBanner2ButtonTextAr: string | null;
    exchangeRate: number;
}

export default function SiteContentClient({ 
    initialSettings,
    categories,
}: { 
    initialSettings: SiteSettings | null;
    categories: FooterCategoryOption[];
}) {
    const { t } = useLanguage();
    const { openSidebar } = useAdminSidebar();

    // Site Settings State - Categories CTA
    const [ctaTitle, setCtaTitle] = useState(initialSettings?.categoriesCtaTitle || "");
    const [ctaDesc, setCtaDesc] = useState(initialSettings?.categoriesCtaDesc || "");
    const [ctaTitleAr, setCtaTitleAr] = useState(initialSettings?.categoriesCtaTitleAr || "");
    const [ctaDescAr, setCtaDescAr] = useState(initialSettings?.categoriesCtaDescAr || "");
    const [ctaImage, setCtaImage] = useState(initialSettings?.categoriesCtaImage || "");
    const [footerContent, setFooterContent] = useState({
        footerBrandTitle: initialSettings?.footerBrandTitle || "",
        footerBrandTitleAr: initialSettings?.footerBrandTitleAr || "",
        footerBrandDescription: initialSettings?.footerBrandDescription || "",
        footerBrandDescriptionAr: initialSettings?.footerBrandDescriptionAr || "",
        footerCopyright: initialSettings?.footerCopyright || "",
        footerCopyrightAr: initialSettings?.footerCopyrightAr || "",
        footerInstagramUrl: initialSettings?.footerInstagramUrl || "",
        footerFacebookUrl: initialSettings?.footerFacebookUrl || "",
        footerWhatsappUrl: initialSettings?.footerWhatsappUrl || "",
        footerShopTitle: initialSettings?.footerShopTitle || "",
        footerShopTitleAr: initialSettings?.footerShopTitleAr || "",
        footerSupportTitle: initialSettings?.footerSupportTitle || "",
        footerSupportTitleAr: initialSettings?.footerSupportTitleAr || "",
        footerCompanyTitle: initialSettings?.footerCompanyTitle || "",
        footerCompanyTitleAr: initialSettings?.footerCompanyTitleAr || "",
        footerSupportLink1Label: initialSettings?.footerSupportLink1Label || "",
        footerSupportLink1LabelAr: initialSettings?.footerSupportLink1LabelAr || "",
        footerSupportLink1Url: initialSettings?.footerSupportLink1Url || "",
        footerSupportLink2Label: initialSettings?.footerSupportLink2Label || "",
        footerSupportLink2LabelAr: initialSettings?.footerSupportLink2LabelAr || "",
        footerSupportLink2Url: initialSettings?.footerSupportLink2Url || "",
        footerSupportLink3Label: initialSettings?.footerSupportLink3Label || "",
        footerSupportLink3LabelAr: initialSettings?.footerSupportLink3LabelAr || "",
        footerSupportLink3Url: initialSettings?.footerSupportLink3Url || "",
        footerCompanyLink1Label: initialSettings?.footerCompanyLink1Label || "",
        footerCompanyLink1LabelAr: initialSettings?.footerCompanyLink1LabelAr || "",
        footerCompanyLink1Url: initialSettings?.footerCompanyLink1Url || "",
        footerCompanyLink2Label: initialSettings?.footerCompanyLink2Label || "",
        footerCompanyLink2LabelAr: initialSettings?.footerCompanyLink2LabelAr || "",
        footerCompanyLink2Url: initialSettings?.footerCompanyLink2Url || "",
        footerCompanyLink3Label: initialSettings?.footerCompanyLink3Label || "",
        footerCompanyLink3LabelAr: initialSettings?.footerCompanyLink3LabelAr || "",
        footerCompanyLink3Url: initialSettings?.footerCompanyLink3Url || "",
        footerCategory1Id: initialSettings?.footerCategory1Id || "",
        footerCategory2Id: initialSettings?.footerCategory2Id || "",
        footerCategory3Id: initialSettings?.footerCategory3Id || "",
        footerCategory4Id: initialSettings?.footerCategory4Id || "",
    });

    // Site Settings State - About Us
    const [aboutHeroTitle, setAboutHeroTitle] = useState(initialSettings?.aboutHeroTitle || "");
    const [aboutHeroTitleAr, setAboutHeroTitleAr] = useState(initialSettings?.aboutHeroTitleAr || "");
    const [aboutHeroSubtitle, setAboutHeroSubtitle] = useState(initialSettings?.aboutHeroSubtitle || "");
    const [aboutHeroSubtitleAr, setAboutHeroSubtitleAr] = useState(initialSettings?.aboutHeroSubtitleAr || "");
    const [aboutHeroImage, setAboutHeroImage] = useState(initialSettings?.aboutHeroImage || "");
    
    const [aboutNarrativeTitle, setAboutNarrativeTitle] = useState(initialSettings?.aboutNarrativeTitle || "");
    const [aboutNarrativeTitleAr, setAboutNarrativeTitleAr] = useState(initialSettings?.aboutNarrativeTitleAr || "");
    const [aboutNarrativeFounded, setAboutNarrativeFounded] = useState(initialSettings?.aboutNarrativeFounded || "Founded in 2024");
    const [aboutNarrativeFoundedAr, setAboutNarrativeFoundedAr] = useState(initialSettings?.aboutNarrativeFoundedAr || "تأسست في 2024");
    const [aboutNarrativeDesc1, setAboutNarrativeDesc1] = useState(initialSettings?.aboutNarrativeDesc1 || "");
    const [aboutNarrativeDesc1Ar, setAboutNarrativeDesc1Ar] = useState(initialSettings?.aboutNarrativeDesc1Ar || "");
    const [aboutNarrativeDesc2, setAboutNarrativeDesc2] = useState(initialSettings?.aboutNarrativeDesc2 || "");
    const [aboutNarrativeDesc2Ar, setAboutNarrativeDesc2Ar] = useState(initialSettings?.aboutNarrativeDesc2Ar || "");
    const [aboutNarrativeQuote, setAboutNarrativeQuote] = useState(initialSettings?.aboutNarrativeQuote || "");
    const [aboutNarrativeQuoteAr, setAboutNarrativeQuoteAr] = useState(initialSettings?.aboutNarrativeQuoteAr || "");
    const [aboutNarrativeImage, setAboutNarrativeImage] = useState(initialSettings?.aboutNarrativeImage || "");

    // Site Settings State - Shipping & Returns
    const [shippingTitle, setShippingTitle] = useState(initialSettings?.shippingTitle || "");
    const [shippingDesc, setShippingDesc] = useState(initialSettings?.shippingDesc || "");
    const [shippingTitleAr, setShippingTitleAr] = useState(initialSettings?.shippingTitleAr || "");
    const [shippingDescAr, setShippingDescAr] = useState(initialSettings?.shippingDescAr || "");

    const [verificationTitle, setVerificationTitle] = useState(initialSettings?.verificationTitle || "");
    const [verificationDesc, setVerificationDesc] = useState(initialSettings?.verificationDesc || "");
    const [verificationTitleAr, setVerificationTitleAr] = useState(initialSettings?.verificationTitleAr || "");
    const [verificationDescAr, setVerificationDescAr] = useState(initialSettings?.verificationDescAr || "");

    const [standardShippingTime, setStandardShippingTime] = useState(initialSettings?.standardShippingTime || "");
    const [expressShippingTime, setExpressShippingTime] = useState(initialSettings?.expressShippingTime || "");

    const [returnsTitle, setReturnsTitle] = useState(initialSettings?.returnsTitle || "");
    const [returnsDesc, setReturnsDesc] = useState(initialSettings?.returnsDesc || "");
    const [returnsTitleAr, setReturnsTitleAr] = useState(initialSettings?.returnsTitleAr || "");
    const [returnsDescAr, setReturnsDescAr] = useState(initialSettings?.returnsDescAr || "");

    const [finalSaleTitle, setFinalSaleTitle] = useState(initialSettings?.finalSaleTitle || "");
    const [finalSaleDesc, setFinalSaleDesc] = useState(initialSettings?.finalSaleDesc || "");
    const [finalSaleTitleAr, setFinalSaleTitleAr] = useState(initialSettings?.finalSaleTitleAr || "");
    const [finalSaleDescAr, setFinalSaleDescAr] = useState(initialSettings?.finalSaleDescAr || "");

    const [hygieneTitle, setHygieneTitle] = useState(initialSettings?.hygieneTitle || "");
    const [hygieneDesc, setHygieneDesc] = useState(initialSettings?.hygieneDesc || "");
    const [hygieneTitleAr, setHygieneTitleAr] = useState(initialSettings?.hygieneTitleAr || "");
    const [hygieneDescAr, setHygieneDescAr] = useState(initialSettings?.hygieneDescAr || "");

    const [shippingReturnsImage, setShippingReturnsImage] = useState(initialSettings?.shippingReturnsImage || "");

    const [exchangeRate, setExchangeRate] = useState(initialSettings?.exchangeRate || 135);

    // Middle Banner 1
    const [middleBanner1Image, setMiddleBanner1Image] = useState(initialSettings?.middleBanner1Image || "");
    const [middleBanner1Link, setMiddleBanner1Link] = useState(initialSettings?.middleBanner1Link || "");

    // Middle Banner 2
    const [middleBanner2Image, setMiddleBanner2Image] = useState(initialSettings?.middleBanner2Image || "");
    const [middleBanner2Link, setMiddleBanner2Link] = useState(initialSettings?.middleBanner2Link || "");
    const [middleBanner2Title, setMiddleBanner2Title] = useState(initialSettings?.middleBanner2Title || "");
    const [middleBanner2TitleAr, setMiddleBanner2TitleAr] = useState(initialSettings?.middleBanner2TitleAr || "");
    const [middleBanner2Subtitle, setMiddleBanner2Subtitle] = useState(initialSettings?.middleBanner2Subtitle || "");
    const [middleBanner2SubtitleAr, setMiddleBanner2SubtitleAr] = useState(initialSettings?.middleBanner2SubtitleAr || "");
    const [middleBanner2ButtonText, setMiddleBanner2ButtonText] = useState(initialSettings?.middleBanner2ButtonText || "");
    const [middleBanner2ButtonTextAr, setMiddleBanner2ButtonTextAr] = useState(initialSettings?.middleBanner2ButtonTextAr || "");

    const [isSubmittingSettings, setIsSubmittingSettings] = useState(false);
    const [isSubmittingCurrency, setIsSubmittingCurrency] = useState(false);

    const handleFooterFieldChange = (field: string, value: string) => {
        setFooterContent((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleSiteSettingsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingSettings(true);

        try {
            const result = await updateSiteSettings({
                categoriesCtaTitle: ctaTitle,
                categoriesCtaDesc: ctaDesc,
                categoriesCtaTitleAr: ctaTitleAr,
                categoriesCtaDescAr: ctaDescAr,
                categoriesCtaImage: ctaImage,
                ...footerContent,
                footerCategory1Id: footerContent.footerCategory1Id || null,
                footerCategory2Id: footerContent.footerCategory2Id || null,
                footerCategory3Id: footerContent.footerCategory3Id || null,
                footerCategory4Id: footerContent.footerCategory4Id || null,
                shippingTitle,
                shippingDesc,
                shippingTitleAr,
                shippingDescAr,
                verificationTitle,
                verificationDesc,
                verificationTitleAr,
                verificationDescAr,
                standardShippingTime,
                expressShippingTime,
                returnsTitle,
                returnsDesc,
                returnsTitleAr,
                returnsDescAr,
                finalSaleTitle,
                finalSaleDesc,
                finalSaleTitleAr,
                finalSaleDescAr,
                hygieneTitle,
                hygieneDesc,
                hygieneTitleAr,
                hygieneDescAr,
                shippingReturnsImage,
                aboutHeroTitle,
                aboutHeroTitleAr,
                aboutHeroSubtitle,
                aboutHeroSubtitleAr,
                aboutHeroImage,
                aboutNarrativeTitle,
                aboutNarrativeTitleAr,
                aboutNarrativeFounded,
                aboutNarrativeFoundedAr,
                aboutNarrativeDesc1,
                aboutNarrativeDesc1Ar,
                aboutNarrativeDesc2,
                aboutNarrativeDesc2Ar,
                aboutNarrativeQuote,
                aboutNarrativeQuoteAr,
                aboutNarrativeImage,
                middleBanner1Image,
                middleBanner1Link,
                middleBanner2Image,
                middleBanner2Link,
                middleBanner2Title,
                middleBanner2TitleAr,
                middleBanner2Subtitle,
                middleBanner2SubtitleAr,
                middleBanner2ButtonText,
                middleBanner2ButtonTextAr,
                exchangeRate: Number(exchangeRate),
            });

            if (result.success) {
                toast.success(t('admin.settingsUpdated') || "Settings updated successfully");
            } else {
                toast.error(result.error || t('admin.failedToUpdate') || "Failed to update");
            }
        } catch (error) {
            console.error("Error updating site settings:", error);
            toast.error(t('admin.failedToUpdate') || "Failed to update");
        } finally {
            setIsSubmittingSettings(false);
        }
    };

    const handleCurrencySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingCurrency(true);

        try {
            const result = await updateSiteSettings({
                exchangeRate: Number(exchangeRate),
                // Pass current values for other fields to prevent overriding them with null/empty
                categoriesCtaTitle: ctaTitle,
                categoriesCtaDesc: ctaDesc,
                categoriesCtaTitleAr: ctaTitleAr,
                categoriesCtaDescAr: ctaDescAr,
                categoriesCtaImage: ctaImage,
                ...footerContent,
                footerCategory1Id: footerContent.footerCategory1Id || null,
                footerCategory2Id: footerContent.footerCategory2Id || null,
                footerCategory3Id: footerContent.footerCategory3Id || null,
                footerCategory4Id: footerContent.footerCategory4Id || null,
                shippingTitle,
                shippingDesc,
                shippingTitleAr,
                shippingDescAr,
                verificationTitle,
                verificationDesc,
                verificationTitleAr,
                verificationDescAr,
                standardShippingTime,
                expressShippingTime,
                returnsTitle,
                returnsDesc,
                returnsTitleAr,
                returnsDescAr,
                finalSaleTitle,
                finalSaleDesc,
                finalSaleTitleAr,
                finalSaleDescAr,
                hygieneTitle,
                hygieneDesc,
                hygieneTitleAr,
                hygieneDescAr,
                shippingReturnsImage,
                aboutHeroTitle,
                aboutHeroTitleAr,
                aboutHeroSubtitle,
                aboutHeroSubtitleAr,
                aboutHeroImage,
                aboutNarrativeTitle,
                aboutNarrativeTitleAr,
                aboutNarrativeFounded,
                aboutNarrativeFoundedAr,
                aboutNarrativeDesc1,
                aboutNarrativeDesc1Ar,
                aboutNarrativeDesc2,
                aboutNarrativeDesc2Ar,
                aboutNarrativeQuote,
                aboutNarrativeQuoteAr,
                aboutNarrativeImage,
                middleBanner1Image,
                middleBanner1Link,
                middleBanner2Image,
                middleBanner2Link,
                middleBanner2Title,
                middleBanner2TitleAr,
                middleBanner2Subtitle,
                middleBanner2SubtitleAr,
                middleBanner2ButtonText,
                middleBanner2ButtonTextAr,
            });

            if (result.success) {
                toast.success(t('admin.settingsUpdated') || "Currency settings updated successfully");
            } else {
                toast.error(result.error || t('admin.failedToUpdate') || "Failed to update currency settings");
            }
        } catch (error) {
            console.error("Error updating currency settings:", error);
            toast.error(t('admin.failedToUpdate') || "Failed to update");
        } finally {
            setIsSubmittingCurrency(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <AdminHeader title={t('admin.siteContent')} onMenuClick={openSidebar} />

            <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Currency Settings Section - Now First */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] p-8 mb-8">
                        <div className="mb-6">
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-main dark:text-white mb-2">
                                {t('admin.currencySettings')}
                            </h2>
                            <p className="text-text-sub dark:text-gray-400">
                                {t('admin.currencySettingsDesc')}
                            </p>
                        </div>
                        <form onSubmit={handleCurrencySubmit} className="space-y-6">
                            <div className="space-y-4 max-w-md">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-text-main dark:text-white">
                                        {t('admin.exchangeRate')}
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={exchangeRate}
                                        onChange={(e) => setExchangeRate(Number(e.target.value))}
                                        className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSubmittingCurrency}
                                    className="min-w-[160px] rounded-xl bg-primary px-6 py-2.5 font-bold text-white transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isSubmittingCurrency ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            {t('admin.saving')}
                                        </span>
                                    ) : (
                                        t('admin.saveChanges')
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Site Content Settings */}
                    <div className="space-y-8">
                        <form onSubmit={handleSiteSettingsSubmit} className="space-y-6">
                            <FooterContentSection
                                footerContent={footerContent}
                                categories={categories}
                                onFieldChange={handleFooterFieldChange}
                                t={t}
                            />

                            {/* Middle Banner 1 Section */}
                            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] p-8">
                                <div className="mb-6">
                                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-main dark:text-white mb-2">
                                        {t('admin.middleBanner1') || "Middle Banner 1 (After Trending)"}
                                    </h2>
                                    <p className="text-text-sub dark:text-gray-400">
                                        {t('admin.middleBanner1Desc') || "Control the banner that appears after the Trending Products section."}
                                    </p>
                                </div>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-text-main dark:text-white">
                                                {t('admin.imageUrl')}
                                                <span className="block text-[10px] text-primary/70 font-normal">
                                                    {t('admin.recommendedResolution')}: {t('admin.res21_6')}
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                value={middleBanner1Image}
                                                onChange={(e) => setMiddleBanner1Image(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-text-main dark:text-white">
                                                {t('admin.linkUrl')} ({t('admin.optional') || "Optional"})
                                            </label>
                                            <input
                                                type="text"
                                                value={middleBanner1Link}
                                                onChange={(e) => setMiddleBanner1Link(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                placeholder="/products/..."
                                            />
                                        </div>
                                    </div>
                                    {middleBanner1Image && (
                                        <div className="relative aspect-[21/9] md:aspect-[21/6] rounded-xl overflow-hidden border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04]">
                                            <img src={middleBanner1Image} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Middle Banner 2 Section */}
                            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] p-8">
                                <div className="mb-6">
                                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-main dark:text-white mb-2">
                                        {t('admin.middleBanner2') || "Middle Banner 2 (After Brands)"}
                                    </h2>
                                    <p className="text-text-sub dark:text-gray-400">
                                        {t('admin.middleBanner2Desc') || "Control the banner that appears after the Brands section. This banner supports text overlays."}
                                    </p>
                                </div>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-text-main dark:text-white">
                                                {t('admin.imageUrl')}
                                                <span className="block text-[10px] text-primary/70 font-normal">
                                                    {t('admin.recommendedResolution')}: {t('admin.res21_6')}
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                value={middleBanner2Image}
                                                onChange={(e) => setMiddleBanner2Image(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-text-main dark:text-white">
                                                {t('admin.linkUrl')} ({t('admin.optional') || "Optional"})
                                            </label>
                                            <input
                                                type="text"
                                                value={middleBanner2Link}
                                                onChange={(e) => setMiddleBanner2Link(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                placeholder="/products/..."
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-text-main dark:text-white">{t('admin.englishLabel')} - {t('admin.title')}</label>
                                            <input
                                                type="text"
                                                value={middleBanner2Title}
                                                onChange={(e) => setMiddleBanner2Title(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-text-main dark:text-white">{t('admin.arabicLabel')} - {t('admin.title')}</label>
                                            <input
                                                type="text"
                                                value={middleBanner2TitleAr}
                                                onChange={(e) => setMiddleBanner2TitleAr(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                dir="rtl"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-text-main dark:text-white">{t('admin.englishLabel')} - {t('admin.description')}</label>
                                            <textarea
                                                value={middleBanner2Subtitle}
                                                onChange={(e) => setMiddleBanner2Subtitle(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none min-h-[80px]"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-text-main dark:text-white">{t('admin.arabicLabel')} - {t('admin.description')}</label>
                                            <textarea
                                                value={middleBanner2SubtitleAr}
                                                onChange={(e) => setMiddleBanner2SubtitleAr(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none min-h-[80px]"
                                                dir="rtl"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-text-main dark:text-white">{t('admin.englishLabel')} - {t('admin.buttonText')}</label>
                                            <input
                                                type="text"
                                                value={middleBanner2ButtonText}
                                                onChange={(e) => setMiddleBanner2ButtonText(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-text-main dark:text-white">{t('admin.arabicLabel')} - {t('admin.buttonText')}</label>
                                            <input
                                                type="text"
                                                value={middleBanner2ButtonTextAr}
                                                onChange={(e) => setMiddleBanner2ButtonTextAr(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                dir="rtl"
                                            />
                                        </div>
                                    </div>

                                    {middleBanner2Image && (
                                        <div className="relative aspect-[21/9] md:aspect-[21/6] rounded-xl overflow-hidden border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] group">
                                            <img src={middleBanner2Image} alt="Preview" className="w-full h-full object-cover" />
                                            {(middleBanner2Title || middleBanner2Subtitle) && (
                                                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-8 text-white">
                                                    <h3 className="text-xl font-bold">{middleBanner2Title}</h3>
                                                    <p className="text-xs text-white/80">{middleBanner2Subtitle}</p>
                                                    {middleBanner2ButtonText && (
                                                        <span className="mt-2 inline-block bg-primary text-white text-[10px] px-3 py-1 rounded-full w-fit">
                                                            {middleBanner2ButtonText}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSubmittingSettings}
                                    className="min-w-[200px] rounded-xl bg-primary px-8 py-3 font-bold text-white transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isSubmittingSettings ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            {t('admin.saving')}
                                        </span>
                                    ) : (
                                        t('admin.saveChanges')
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Categories Page CTA */}
                        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] p-8">
                            <div className="mb-8">
                                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-main dark:text-white mb-2">
                                    {t('admin.categoriesPageCta')}
                                </h2>
                                <p className="text-text-sub dark:text-gray-400">
                                    {t('admin.categoriesCtaDescription')}
                                </p>
                            </div>

                            <form onSubmit={handleSiteSettingsSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* English Content */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">EN</span>
                                            <h3 className="font-bold text-text-main dark:text-white">{t('admin.englishContent')}</h3>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-text-main dark:text-white">{t('admin.title')}</label>
                                            <input
                                                type="text"
                                                value={ctaTitle}
                                                onChange={(e) => setCtaTitle(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-text-main dark:text-white">{t('admin.description')}</label>
                                            <textarea
                                                rows={5}
                                                value={ctaDesc}
                                                onChange={(e) => setCtaDesc(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Arabic Content */}
                                    <div className="space-y-6" dir="rtl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">AR</span>
                                            <h3 className="font-bold text-text-main dark:text-white">{t('admin.arabicContent')}</h3>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-text-main dark:text-white">{t('admin.title')}</label>
                                            <input
                                                type="text"
                                                value={ctaTitleAr}
                                                onChange={(e) => setCtaTitleAr(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-text-main dark:text-white">{t('admin.description')}</label>
                                            <textarea
                                                rows={5}
                                                value={ctaDescAr}
                                                onChange={(e) => setCtaDescAr(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Image Settings */}
                                <div className="border-t border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] pt-8 mt-8">
                                    <div className="flex items-center gap-2 mb-6">
                                        <MdImage className="text-primary text-xl" />
                                        <h3 className="font-bold text-text-main dark:text-white text-lg">{t('admin.ctaImage')}</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-text-main dark:text-white">
                                                    {t('admin.imageUrl')}
                                                    <span className="block text-[10px] text-primary/70 font-normal">
                                                        {t('admin.recommendedResolution')}: {t('admin.res3_2')}
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={ctaImage}
                                                    onChange={(e) => setCtaImage(e.target.value)}
                                                    placeholder="https://example.com/image.jpg"
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                />
                                                <p className="text-xs text-text-sub dark:text-gray-400">
                                                    {t('admin.ctaImageDescription')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-text-main dark:text-white">{t('admin.preview')}</label>
                                            <div className="aspect-video rounded-2xl border-2 border-dashed border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] overflow-hidden bg-background-light dark:bg-gray-800 flex items-center justify-center">
                                                {ctaImage ? (
                                                    <img 
                                                        src={ctaImage} 
                                                        alt={t('admin.ctaPreview')} 
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x225?text=Invalid+Image+URL';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="text-center p-6">
                                                        <MdImageNotSupported className="text-4xl text-text-sub/30 mb-2 mx-auto" />
                                                        <p className="text-xs text-text-sub/50">{t('admin.noImageProvided') || "No image URL provided"}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>



                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmittingSettings}
                                        className="px-8 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                                    >
                                        {isSubmittingSettings ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                                                {t('admin.saving')}
                                            </span>
                                        ) : (
                                            t('admin.saveChanges')
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Shipping & Returns Page Content */}
                        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] p-8">
                            <div className="mb-8">
                                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-main dark:text-white mb-2">
                                    {t('admin.shippingReturnsContent')}
                                </h2>
                                <p className="text-text-sub dark:text-gray-400">
                                    {t('admin.shippingReturnsDescription')}
                                </p>
                            </div>

                            <form onSubmit={handleSiteSettingsSubmit} className="space-y-12">
                                {/* Shipping & Returns Page Image */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-6">
                                        <MdImage className="text-primary text-xl" />
                                        <h3 className="font-bold text-text-main dark:text-white text-lg">{t('admin.pageHeaderImage')}</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-text-main dark:text-white">
                                                    {t('admin.imageUrl')}
                                                    <span className="block text-[10px] text-primary/70 font-normal">
                                                        {t('admin.recommendedResolution')}: {t('admin.resWide')}
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={shippingReturnsImage}
                                                    onChange={(e) => setShippingReturnsImage(e.target.value)}
                                                    placeholder="https://example.com/image.jpg"
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                />
                                                <p className="text-xs text-text-sub dark:text-gray-400">
                                                    {t('admin.shippingReturnsImageHint')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-text-main dark:text-white">{t('admin.preview')}</label>
                                            <div className="aspect-video rounded-2xl border-2 border-dashed border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] overflow-hidden bg-background-light dark:bg-gray-800 flex items-center justify-center">
                                                {shippingReturnsImage ? (
                                                    <img 
                                                        src={shippingReturnsImage} 
                                                        alt="Shipping & Returns Preview" 
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x225?text=Invalid+Image+URL';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="text-center p-6">
                                                        <MdImageNotSupported className="text-4xl text-text-sub/30 mb-2 mx-auto" />
                                                        <p className="text-xs text-text-sub/50">{t('admin.noImageProvided') || "No image URL provided"}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 1. Verification Section */}
                                <div className="space-y-6 border-t border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] pt-8">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MdVerified className="text-primary text-xl" />
                                        <h3 className="font-bold text-text-main dark:text-white text-lg">{t('admin.verificationSection')}</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">EN</span>
                                                <span className="text-sm font-bold text-text-main dark:text-white">{t('admin.englishContent')}</span>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.title')}</label>
                                                <input
                                                    type="text"
                                                    value={verificationTitle}
                                                    onChange={(e) => setVerificationTitle(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.description')}</label>
                                                <textarea
                                                    rows={3}
                                                    value={verificationDesc}
                                                    onChange={(e) => setVerificationDesc(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4" dir="rtl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">AR</span>
                                                <span className="text-sm font-bold text-text-main dark:text-white">{t('admin.arabicContent')}</span>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.title')}</label>
                                                <input
                                                    type="text"
                                                    value={verificationTitleAr}
                                                    onChange={(e) => setVerificationTitleAr(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.description')}</label>
                                                <textarea
                                                    rows={3}
                                                    value={verificationDescAr}
                                                    onChange={(e) => setVerificationDescAr(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Shipping Times */}
                                <div className="space-y-6 border-t border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] pt-8">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MdSchedule className="text-primary text-xl" />
                                        <h3 className="font-bold text-text-main dark:text-white text-lg">{t('admin.shippingTimes')}</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-text-main dark:text-white">{t('admin.standardTime')}</label>
                                            <input
                                                type="text"
                                                value={standardShippingTime}
                                                onChange={(e) => setStandardShippingTime(e.target.value)}
                                                placeholder="e.g. 3-5 Business Days"
                                                className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-text-main dark:text-white">{t('admin.expressTime')}</label>
                                            <input
                                                type="text"
                                                value={expressShippingTime}
                                                onChange={(e) => setExpressShippingTime(e.target.value)}
                                                placeholder="e.g. 1-2 Business Days"
                                                className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Shipping Section */}
                                <div className="space-y-6 border-t border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] pt-8">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MdLocalShipping className="text-primary text-xl" />
                                        <h3 className="font-bold text-text-main dark:text-white text-lg">{t('admin.shippingSection')}</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">EN</span>
                                                <span className="text-sm font-bold text-text-main dark:text-white">{t('admin.englishContent')}</span>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.title')}</label>
                                                <input
                                                    type="text"
                                                    value={shippingTitle}
                                                    onChange={(e) => setShippingTitle(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.description')}</label>
                                                <textarea
                                                    rows={3}
                                                    value={shippingDesc}
                                                    onChange={(e) => setShippingDesc(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4" dir="rtl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">AR</span>
                                                <span className="text-sm font-bold text-text-main dark:text-white">{t('admin.arabicContent')}</span>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.title')}</label>
                                                <input
                                                    type="text"
                                                    value={shippingTitleAr}
                                                    onChange={(e) => setShippingTitleAr(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.description')}</label>
                                                <textarea
                                                    rows={3}
                                                    value={shippingDescAr}
                                                    onChange={(e) => setShippingDescAr(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 4. Final Sale Section */}
                                <div className="space-y-6 border-t border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] pt-8">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MdWarning className="text-primary text-xl" />
                                        <h3 className="font-bold text-text-main dark:text-white text-lg">{t('admin.finalSaleSection')}</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">EN</span>
                                                <span className="text-sm font-bold text-text-main dark:text-white">{t('admin.englishContent')}</span>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.title')}</label>
                                                <input
                                                    type="text"
                                                    value={finalSaleTitle}
                                                    onChange={(e) => setFinalSaleTitle(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.description')}</label>
                                                <textarea
                                                    rows={3}
                                                    value={finalSaleDesc}
                                                    onChange={(e) => setFinalSaleDesc(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4" dir="rtl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">AR</span>
                                                <span className="text-sm font-bold text-text-main dark:text-white">{t('admin.arabicContent')}</span>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.title')}</label>
                                                <input
                                                    type="text"
                                                    value={finalSaleTitleAr}
                                                    onChange={(e) => setFinalSaleTitleAr(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.description')}</label>
                                                <textarea
                                                    rows={3}
                                                    value={finalSaleDescAr}
                                                    onChange={(e) => setFinalSaleDescAr(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 5. Hygiene Section */}
                                <div className="space-y-6 border-t border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] pt-8">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MdCleanHands className="text-primary text-xl" />
                                        <h3 className="font-bold text-text-main dark:text-white text-lg">{t('admin.hygieneProtocols')}</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">EN</span>
                                                <span className="text-sm font-bold text-text-main dark:text-white">{t('admin.englishContent')}</span>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.hygieneImage')}</label>
                                                <input
                                                    type="text"
                                                    value={hygieneTitle}
                                                    onChange={(e) => setHygieneTitle(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.description')}</label>
                                                <textarea
                                                    rows={3}
                                                    value={hygieneDesc}
                                                    onChange={(e) => setHygieneDesc(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4" dir="rtl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">AR</span>
                                                <span className="text-sm font-bold text-text-main dark:text-white">{t('admin.arabicContent')}</span>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.hygieneImage')}</label>
                                                <input
                                                    type="text"
                                                    value={hygieneTitleAr}
                                                    onChange={(e) => setHygieneTitleAr(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.description')}</label>
                                                <textarea
                                                    rows={3}
                                                    value={hygieneDescAr}
                                                    onChange={(e) => setHygieneDescAr(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 6. Returns Section */}
                                <div className="space-y-6 border-t border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] pt-8">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MdAssignmentReturn className="text-primary text-xl" />
                                        <h3 className="font-bold text-text-main dark:text-white text-lg">{t('admin.returnsSection')}</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">EN</span>
                                                <span className="text-sm font-bold text-text-main dark:text-white">{t('admin.englishContent')}</span>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.title')}</label>
                                                <input
                                                    type="text"
                                                    value={returnsTitle}
                                                    onChange={(e) => setReturnsTitle(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.description')}</label>
                                                <textarea
                                                    rows={3}
                                                    value={returnsDesc}
                                                    onChange={(e) => setReturnsDesc(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4" dir="rtl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">AR</span>
                                                <span className="text-sm font-bold text-text-main dark:text-white">{t('admin.arabicContent')}</span>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.title')}</label>
                                                <input
                                                    type="text"
                                                    value={returnsTitleAr}
                                                    onChange={(e) => setReturnsTitleAr(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.description')}</label>
                                                <textarea
                                                    rows={3}
                                                    value={returnsDescAr}
                                                    onChange={(e) => setReturnsDescAr(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmittingSettings}
                                        className="px-8 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                                    >
                                        {isSubmittingSettings ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                                                {t('admin.saving')}
                                            </span>
                                        ) : (
                                            t('admin.saveChanges')
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* About Us Page Content */}
                        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] p-8">
                            <div className="mb-8">
                                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-main dark:text-white mb-2">
                                    {t('admin.aboutUsContent')}
                                </h2>
                                <p className="text-text-sub dark:text-gray-400">
                                    {t('admin.aboutUsDescription')}
                                </p>
                            </div>

                            <form onSubmit={handleSiteSettingsSubmit} className="space-y-12">
                                {/* Hero Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-6">
                                        <MdImage className="text-primary text-xl" />
                                        <h3 className="font-bold text-text-main dark:text-white text-lg">{t('admin.heroSection')}</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">EN</span>
                                                <span className="text-sm font-bold text-text-main dark:text-white">{t('admin.englishContent')}</span>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.title')}</label>
                                                <input
                                                    type="text"
                                                    value={aboutHeroTitle}
                                                    onChange={(e) => setAboutHeroTitle(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.subtitle')}</label>
                                                <textarea
                                                    rows={3}
                                                    value={aboutHeroSubtitle}
                                                    onChange={(e) => setAboutHeroSubtitle(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4" dir="rtl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">AR</span>
                                                <span className="text-sm font-bold text-text-main dark:text-white">{t('admin.arabicContent')}</span>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.title')}</label>
                                                <input
                                                    type="text"
                                                    value={aboutHeroTitleAr}
                                                    onChange={(e) => setAboutHeroTitleAr(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.subtitle')}</label>
                                                <textarea
                                                    rows={3}
                                                    value={aboutHeroSubtitleAr}
                                                    onChange={(e) => setAboutHeroSubtitleAr(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hero Image */}
                                    <div className="pt-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-text-main dark:text-white">
                                                {t('admin.heroImage')}
                                                <span className="block text-[10px] text-primary/70 font-normal">
                                                    {t('admin.recommendedResolution')}: {t('admin.resHero')}
                                                </span>
                                            </label>
                                            <div className="flex gap-4 items-start">
                                                <div className="flex-1 space-y-2">
                                                    <input
                                                        type="text"
                                                        value={aboutHeroImage}
                                                        onChange={(e) => setAboutHeroImage(e.target.value)}
                                                        placeholder="https://example.com/image.jpg"
                                                        className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                    />
                                                </div>
                                                <div className="w-32 aspect-video rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] overflow-hidden bg-background-light dark:bg-gray-800 flex items-center justify-center">
                                                    {aboutHeroImage ? (
                                                        <img 
                                                            src={aboutHeroImage} 
                                                            alt="Hero Preview" 
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x225?text=Invalid';
                                                            }}
                                                        />
                                                    ) : (
                                                        <MdImageNotSupported className="text-2xl text-text-sub/30" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Narrative Section */}
                                <div className="space-y-6 border-t border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] pt-8">
                                    <div className="flex items-center gap-2 mb-6">
                                        <MdAssignmentReturn className="text-primary text-xl" />
                                        <h3 className="font-bold text-text-main dark:text-white text-lg">{t('admin.narrativeSection')}</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">EN</span>
                                                <span className="text-sm font-bold text-text-main dark:text-white">{t('admin.englishContent')}</span>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.foundedText')}</label>
                                                <input
                                                    type="text"
                                                    value={aboutNarrativeFounded}
                                                    onChange={(e) => setAboutNarrativeFounded(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.title')}</label>
                                                <input
                                                    type="text"
                                                    value={aboutNarrativeTitle}
                                                    onChange={(e) => setAboutNarrativeTitle(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.description')} 1</label>
                                                <textarea
                                                    rows={4}
                                                    value={aboutNarrativeDesc1}
                                                    onChange={(e) => setAboutNarrativeDesc1(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.description')} 2</label>
                                                <textarea
                                                    rows={4}
                                                    value={aboutNarrativeDesc2}
                                                    onChange={(e) => setAboutNarrativeDesc2(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.quote')}</label>
                                                <input
                                                    type="text"
                                                    value={aboutNarrativeQuote}
                                                    onChange={(e) => setAboutNarrativeQuote(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4" dir="rtl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">AR</span>
                                                <span className="text-sm font-bold text-text-main dark:text-white">{t('admin.arabicContent')}</span>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.foundedText')}</label>
                                                <input
                                                    type="text"
                                                    value={aboutNarrativeFoundedAr}
                                                    onChange={(e) => setAboutNarrativeFoundedAr(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.title')}</label>
                                                <input
                                                    type="text"
                                                    value={aboutNarrativeTitleAr}
                                                    onChange={(e) => setAboutNarrativeTitleAr(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.description')} 1</label>
                                                <textarea
                                                    rows={4}
                                                    value={aboutNarrativeDesc1Ar}
                                                    onChange={(e) => setAboutNarrativeDesc1Ar(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.description')} 2</label>
                                                <textarea
                                                    rows={4}
                                                    value={aboutNarrativeDesc2Ar}
                                                    onChange={(e) => setAboutNarrativeDesc2Ar(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">{t('admin.quote')}</label>
                                                <input
                                                    type="text"
                                                    value={aboutNarrativeQuoteAr}
                                                    onChange={(e) => setAboutNarrativeQuoteAr(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Narrative Image */}
                                    <div className="pt-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-text-main dark:text-white">
                                                {t('admin.narrativeImage')}
                                                <span className="block text-[10px] text-primary/70 font-normal">
                                                    {t('admin.recommendedResolution')}: {t('admin.res3_2')}
                                                </span>
                                            </label>
                                            <div className="flex gap-4 items-start">
                                                <div className="flex-1 space-y-2">
                                                    <input
                                                        type="text"
                                                        value={aboutNarrativeImage}
                                                        onChange={(e) => setAboutNarrativeImage(e.target.value)}
                                                        placeholder="https://example.com/image.jpg"
                                                        className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                    />
                                                </div>
                                                <div className="w-32 aspect-video rounded-xl border border-black/[0.04] dark:border-white/[0.04] dark:border-white/[0.04] overflow-hidden bg-background-light dark:bg-gray-800 flex items-center justify-center">
                                                    {aboutNarrativeImage ? (
                                                        <img 
                                                            src={aboutNarrativeImage} 
                                                            alt="Narrative Preview" 
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x225?text=Invalid';
                                                            }}
                                                        />
                                                    ) : (
                                                        <MdImageNotSupported className="text-2xl text-text-sub/30" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmittingSettings}
                                        className="px-8 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                                    >
                                        {isSubmittingSettings ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                                                {t('admin.saving')}
                                            </span>
                                        ) : (
                                            t('admin.saveChanges')
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
