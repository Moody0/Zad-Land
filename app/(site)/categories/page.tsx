import React from "react";
import CategoriesContent from "./CategoriesContent";
import { getSiteSettings } from "@/lib/admin-actions";
import { getCatalogCategories } from "@/lib/catalog";
import { Metadata } from "next";

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
    title: "فئات وأقسام المنتجات الغذائية | Food Categories - Zad Land",
    description: "استعرض كافة فئات المواد الغذائية والاستهلاكية بالجملة: لحوم مجمدة، معلبات، صلصات، حبوب إفطار، قهوة، وشوكولا ومخبوزات معتمدة.",
    alternates: {
        canonical: "/categories",
    },
    openGraph: {
        title: "فئات وأقسام المنتجات | Zad Land",
        description: "استعرض كافة فئات المواد الغذائية والاستهلاكية بالجملة لدى شركة زاد لاند.",
        url: "/categories",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Zad Land Food Categories",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "فئات وأقسام المنتجات | Zad Land",
        description: "استعرض كافة فئات المواد الغذائية والاستهلاكية بالجملة لدى شركة زاد لاند.",
        images: ["/og-image.jpg"],
    },
};

async function getAllCategories() {
    try {
        return await getCatalogCategories();
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
    }
}

export default async function CategoriesPage() {
    const [categories, siteSettings] = await Promise.all([
        getAllCategories(),
        getSiteSettings()
    ]);

    return (
        <CategoriesContent categories={categories} siteSettings={siteSettings} />
    );
}
