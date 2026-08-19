import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductsClient from "../../products/ProductsClient";
import { getBrandBySlug, getCatalogInitialData } from "@/lib/catalog";

export async function generateMetadata(
    props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const params = await props.params;
    const brand = await getBrandBySlug(params.slug);

    if (!brand) {
        return {
            title: "Brand Not Found | Zad Land",
        };
    }

    return {
        title: `${brand.name} | Zad Land`,
        description: brand.description || `Shop ${brand.name} products at Zad Land.`,
    };
}

export default async function BrandPage(
    props: { params: Promise<{ slug: string }> }
) {
    const params = await props.params;
    const brand = await getBrandBySlug(params.slug);

    if (!brand) {
        notFound();
    }

    const { categories, products, totalProducts } = await getCatalogInitialData(undefined, brand.id);

    return (
        <ProductsClient
            key={brand.slug}
            initialCategories={categories}
            initialProducts={products}
            initialTotal={totalProducts}
            activeBrand={brand}
        />
    );
}
