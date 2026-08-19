import { Metadata } from "next";
import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import ProductsClient from "../../products/ProductsClient";
import { getCatalogInitialData, getCategoryBySlug } from "@/lib/catalog";

export async function generateMetadata(
    props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const params = await props.params;
    const category = await getCategoryBySlug(params.slug);

    if (!category) {
        return {
            title: "Category Not Found | Zad Land",
        };
    }

    return {
        title: `${category.name} | Zad Land`,
        description: category.description || `Shop the ${category.name} collection at Zad Land.`,
    };
}

export default async function CategoryPage(
    props: { params: Promise<{ slug: string }> }
) {
    const params = await props.params;
    const activeCategory = await getCategoryBySlug(params.slug);

    if (!activeCategory) {
        notFound();
    }

    const { categories, products, totalProducts } = await getCatalogInitialData(activeCategory.id);

    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <ProductsClient
                key={activeCategory.slug}
                initialCategories={categories}
                initialProducts={products}
                initialTotal={totalProducts}
                activeCategory={activeCategory}
            />
        </Suspense>
    );
}
