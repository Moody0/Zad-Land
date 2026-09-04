"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import { FaWhatsapp } from "react-icons/fa";
import { MdReceiptLong, MdLocalShipping, MdWorkspacePremium, MdPhone } from "react-icons/md";

interface BrandWholesaleInquiryProps {
    brandName: string;
}

export default function BrandWholesaleInquiry({ brandName }: BrandWholesaleInquiryProps) {
    const { language, dir } = useLanguage();
    const isArabic = language === "ar";
    const isRtl = dir === "rtl";

    const nameParts = brandName.split("-");
    const primaryName = isArabic && nameParts.length > 1
        ? nameParts[1].trim()
        : (nameParts[0]?.trim() || brandName);

    const whatsappMessage = encodeURIComponent(
        isArabic
            ? `مرحباً شركة زاد لاند، أود الاستفسار عن طلبات الجملة الكبرى وتوريد كميات/طبالي لمنتجات علامة (${primaryName}).`
            : `Hello Zad Land, I would like to inquire about volume wholesale and pallet supply for (${primaryName}) products.`
    );
    const whatsappUrl = `https://wa.me/963933254796?text=${whatsappMessage}`;

    return (
        <section className="mt-14 mb-8" aria-label="Wholesale Inquiries">
            <div className="relative rounded-2xl md:rounded-3xl bg-[#072835] text-white p-6 sm:p-8 md:p-10 overflow-hidden shadow-md">
                {/* Subtle Geometric Background Pattern */}
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-[#B8860B]/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
                    {/* Text Column */}
                    <div className={`max-w-2xl ${isRtl ? "text-right" : "text-left"} text-center lg:text-start`}>
                        <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#E5B54A] mb-2">
                            {isArabic ? "خدمات كبار العملاء والتوريد التجاري" : "COMMERCIAL & PALLET SUPPLY"}
                        </span>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight mb-3">
                            {isArabic 
                                ? `طلبات الجملة الكبرى وتوريد الطبالي لعلامة ${primaryName}`
                                : `Volume Pallet Orders & Commercial Supply for ${primaryName}`
                            }
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                            {isArabic
                                ? `هل تدير سلسلة متاجر أو تبحث عن توريد حاويات وكميات تجارية خاصة؟ يوفر قسم مبيعات الجملة في شركة زاد لاند أسعاراً تفضيلية، فواتير رسمية، وجداول توريد منتظمة لكافة المحافظات.`
                                : `Managing a retail chain or looking for container loads? Zad Land's wholesale desk provides tiered commercial pricing, certified tax invoicing, and reliable scheduled logistics nationwide.`
                            }
                        </p>

                        {/* Trust Pillars */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-slate-300">
                                <MdReceiptLong className="text-[#E5B54A] text-base shrink-0" />
                                <span>{isArabic ? "فواتير تجارية رسمية" : "Official Tax Invoices"}</span>
                            </div>
                            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-slate-300">
                                <MdLocalShipping className="text-[#E5B54A] text-base shrink-0" />
                                <span>{isArabic ? "شحن لكافة المحافظات" : "Nationwide Delivery"}</span>
                            </div>
                            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-slate-300">
                                <MdWorkspacePremium className="text-[#E5B54A] text-base shrink-0" />
                                <span>{isArabic ? "شهادات مطابقة المنشأ" : "Certified Authentic Stock"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Column */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
                        <Link
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-xs"
                        >
                            <FaWhatsapp className="text-lg shrink-0" />
                            <span>{isArabic ? "طلب تسعيرة عبر واتساب" : "WhatsApp Wholesale Quote"}</span>
                        </Link>

                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm transition-all border border-white/10"
                        >
                            <MdPhone className="text-base shrink-0" />
                            <span>{isArabic ? "التواصل مع إدارة المبيعات" : "Contact Wholesale Team"}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
