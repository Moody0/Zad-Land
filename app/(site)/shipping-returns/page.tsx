import React from "react";
import { getSiteSettings } from "@/lib/admin-actions";
import ShippingReturnsContent from "./ShippingReturnsContent";
import { Metadata } from "next";

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
    title: "الشحن والتوصيل وسياسة التوريد | Shipping & Delivery Terms - Zad Land",
    description: "تعرف على شروط الشحن والتوريد المباشر لكافة المحافظات والمناطق وسياسة الاستلام المعتمدة لدى شركة زاد لاند لتجارة وتوزيع المواد الغذائية.",
    alternates: {
        canonical: "/shipping-returns",
    },
    openGraph: {
        title: "الشحن والتوصيل وسياسة التوريد | Zad Land",
        description: "تعرف على شروط الشحن والتوريد المباشر وسياسة الاستلام المعتمدة لدى شركة زاد لاند.",
        url: "/shipping-returns",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Zad Land Shipping & Returns",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "الشحن والتوصيل وسياسة التوريد | Zad Land",
        description: "تعرف على شروط الشحن والتوريد المباشر وسياسة الاستلام المعتمدة لدى شركة زاد لاند.",
        images: ["/og-image.jpg"],
    },
};

export default async function ShippingReturnsPage() {
    const siteSettings = await getSiteSettings();

    return (
        <ShippingReturnsContent siteSettings={siteSettings} />
    );
}
