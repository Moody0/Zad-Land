"use client";

import React from "react";
import Link from "next/link";
import ResilientImage from "@/app/components/ResilientImage";
import { useLanguage } from "@/app/context/LanguageContext";
import { 
    MdVerified, 
    MdInventory2, 
    MdLocalShipping, 
    MdStorefront,
    MdChevronRight,
    MdChevronLeft
} from "react-icons/md";

interface BrandMastheadProps {
    brand: {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        image: string | null;
        group?: string;
        isFeatured?: boolean;
        mainCategory?: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
        } | null;
    };
    totalProducts: number;
}

export default function BrandMasthead({ brand, totalProducts }: BrandMastheadProps) {
    const { language, dir } = useLanguage();
    const isArabic = language === "ar";
    const isRtl = dir === "rtl";

    const fallbackImage = "/placeholder.svg";
    const brandImage = brand.image || fallbackImage;

    // Parse bilingual name formatted as "Alicafe - علي كافيه"
    const nameParts = brand.name.split("-");
    const primaryName = isArabic && nameParts.length > 1
        ? nameParts[1].trim()
        : (nameParts[0]?.trim() || brand.name);

    const secondaryName = nameParts.length > 1
        ? (isArabic ? nameParts[0].trim() : nameParts[1].trim())
        : null;

    const sectorName = brand.mainCategory 
        ? (isArabic ? brand.mainCategory.name : (brand.mainCategory.description || brand.mainCategory.name))
        : (isArabic ? "المواد الغذائية والاستهلاكية" : "Food & Consumer Goods");

    const defaultNarrative = isArabic
        ? `الكتالوج الرسمي المعتمد لتجارة وتوزيع منتجات ${primaryName} بالجملة عبر شركة زاد لاند. توريد طرود وكراتين المصنع الأصلية للمتاجر والسوبرماركت والمقاهي مع ضمان جودة التخزين وتواريخ الصلاحية الحديثة.`
        : `Official authorized wholesale catalog and distribution for ${primaryName} by Zad Land. Direct supply of authentic master cartons and pallets for retailers, supermarkets, and foodservice with certified origin.`;

    const displayDescription = brand.description && brand.description.trim().length > 0
        ? brand.description
        : defaultNarrative;

    return (
        <section className="mb-8" aria-label="Brand Overview">
            {/* Clean Breadcrumb Strip */}
            <nav 
                className="flex items-center flex-wrap gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4"
                aria-label="Breadcrumb"
            >
                <Link 
                    href="/" 
                    className="hover:text-[#072835] dark:hover:text-white transition-colors py-1"
                >
                    {isArabic ? "الرئيسية" : "Home"}
                </Link>
                {isRtl ? (
                    <MdChevronLeft className="text-slate-400 dark:text-slate-600 text-sm shrink-0" />
                ) : (
                    <MdChevronRight className="text-slate-400 dark:text-slate-600 text-sm shrink-0" />
                )}
                <Link 
                    href="/brands" 
                    className="hover:text-[#072835] dark:hover:text-white transition-colors py-1"
                >
                    {isArabic ? "العلامات التجارية" : "Brands"}
                </Link>
                {isRtl ? (
                    <MdChevronLeft className="text-slate-400 dark:text-slate-600 text-sm shrink-0" />
                ) : (
                    <MdChevronRight className="text-slate-400 dark:text-slate-600 text-sm shrink-0" />
                )}
                <span className="text-[#072835] dark:text-white font-bold truncate max-w-[200px] sm:max-w-none">
                    {primaryName}
                </span>
            </nav>

            {/* Architectural Masthead Card */}
            <div className="relative rounded-2xl md:rounded-3xl bg-white dark:bg-[#0C1821] border border-slate-200/80 dark:border-white/10 shadow-xs overflow-hidden">
                {/* Refined Brand Accent Bar */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#072835] via-[#B8860B] to-[#072835]" />

                <div className="p-5 sm:p-7 md:p-8">
                    {/* Top Identity Block */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-7">
                        {/* Logo Plinth Tile */}
                        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl bg-white dark:bg-zinc-800/80 border border-slate-200/80 dark:border-white/10 shadow-sm p-3.5 flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-[1.02]">
                            <div className="relative w-full h-full flex items-center justify-center">
                                <ResilientImage
                                    src={brandImage}
                                    alt={brand.name}
                                    showSkeleton={false}
                                    className="max-w-full max-h-full object-contain"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Brand Details */}
                        <div className={`flex-1 min-w-0 ${isRtl ? "text-right" : "text-left"} text-center sm:text-start`}>
                            {/* Sector & Authorization Eyebrow */}
                            <div className="flex items-center justify-center sm:justify-start flex-wrap gap-2 mb-2">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#FAF6EC] dark:bg-[#B8860B]/15 text-[#8D6504] dark:text-[#E5B54A] text-[11px] font-bold tracking-wide border border-[#B8860B]/20">
                                    <MdVerified className="text-xs shrink-0" />
                                    <span>{isArabic ? "موزع رسمي معتمد" : "Authorized Wholesale Partner"}</span>
                                </span>
                                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 hidden sm:inline">•</span>
                                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                    {sectorName}
                                </span>
                            </div>

                            {/* Dual-Language Title Treatment */}
                            <div className="flex flex-wrap items-baseline justify-center sm:justify-start gap-x-3 gap-y-1 mb-2.5">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#072835] dark:text-white tracking-tight">
                                    {primaryName}
                                </h1>
                                {secondaryName && (
                                    <span className="text-sm sm:text-base md:text-lg font-medium text-slate-400 dark:text-slate-500 tracking-wider">
                                        {secondaryName}
                                    </span>
                                )}
                            </div>

                            {/* Authentic Brand Narrative */}
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                                {displayDescription}
                            </p>
                        </div>
                    </div>

                    {/* Grounded B2B Wholesale Trust Specs Strip */}
                    <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/5 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-slate-50/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/5">
                            <div className="w-8 h-8 rounded-lg bg-[#072835]/5 dark:bg-white/10 text-[#072835] dark:text-[#E5B54A] flex items-center justify-center shrink-0">
                                <MdStorefront className="text-base" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                                    {isArabic ? "الوكالة والتوزيع" : "Distribution"}
                                </p>
                                <p className="text-xs sm:text-sm font-bold text-[#072835] dark:text-white truncate">
                                    {isArabic ? "استيراد مباشر رسمي" : "Direct Official Import"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-slate-50/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/5">
                            <div className="w-8 h-8 rounded-lg bg-[#072835]/5 dark:bg-white/10 text-[#072835] dark:text-[#E5B54A] flex items-center justify-center shrink-0">
                                <MdInventory2 className="text-base" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                                    {isArabic ? "الكتالوج المتاح" : "Catalog Volume"}
                                </p>
                                <p className="text-xs sm:text-sm font-bold text-[#072835] dark:text-white truncate">
                                    {totalProducts} {isArabic ? "صنف متوفر بالجملة" : "Wholesale SKUs"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-slate-50/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/5">
                            <div className="w-8 h-8 rounded-lg bg-[#072835]/5 dark:bg-white/10 text-[#072835] dark:text-[#E5B54A] flex items-center justify-center shrink-0">
                                <MdLocalShipping className="text-base" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                                    {isArabic ? "معيار التعبئة" : "Packaging Unit"}
                                </p>
                                <p className="text-xs sm:text-sm font-bold text-[#072835] dark:text-white truncate">
                                    {isArabic ? "طرود وكراتين المصنع" : "Original Master Cases"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-slate-50/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/5">
                            <div className="w-8 h-8 rounded-lg bg-[#072835]/5 dark:bg-white/10 text-[#072835] dark:text-[#E5B54A] flex items-center justify-center shrink-0">
                                <MdVerified className="text-base" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                                    {isArabic ? "جاهزية المستودع" : "Availability"}
                                </p>
                                <p className="text-xs sm:text-sm font-bold text-[#072835] dark:text-white truncate">
                                    {isArabic ? "شحن وتوريد فوري" : "Immediate Dispatch"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
