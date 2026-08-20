import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import ProductsClient from "./ProductsClient";
import { getCatalogInitialData } from "@/lib/catalog";
import { findCategoryByIdentifier } from "@/lib/category-utils";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "كتالوج المنتجات وعروض الجملة | Products Catalog - Zad Land",
    description: "تصفح كافة منتجات المواد الغذائية، المعلبات، اللحوم، الباستا، الحلويات، والمشروبات بأسعار الجملة المعتمدة لدى شركة زاد لاند.",
    alternates: {
        canonical: "/products",
    },
    openGraph: {
        title: "كتالوج المنتجات وعروض الجملة | Zad Land",
        description: "تصفح كافة منتجات المواد الغذائية والاستهلاكية بأسعار الجملة المعتمدة لدى شركة زاد لاند.",
        url: "/products",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Zad Land Product Catalog",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "كتالوج المنتجات وعروض الجملة | Zad Land",
        description: "تصفح كافة منتجات المواد الغذائية والاستهلاكية بأسعار الجملة المعتمدة لدى شركة زاد لاند.",
        images: ["/og-image.jpg"],
    },
};

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const category = typeof params.category === "string" ? params.category : null;

    if (category) {
        const resolvedCategory = await findCategoryByIdentifier(category);
        redirect(resolvedCategory ? `/categories/${resolvedCategory.slug}` : "/products");
    }

    const { categories, products, totalProducts } = await getCatalogInitialData();

    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <ProductsClient
                key="all-products"
                initialCategories={categories}
                initialProducts={products}
                initialTotal={totalProducts}
                activeCategory={null}
            />
        </Suspense>
    );
}
