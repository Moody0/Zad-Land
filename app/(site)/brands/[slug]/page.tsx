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

    const title = `${brand.name} | Zad Land - زاد لاند`;
    const description = brand.description || `تصفح كتالوج منتجات ${brand.name} بأسعار الجملة المعتمدة لدى شركة زاد لاند لتجارة وتوزيع المواد الغذائية.`;
    const image = brand.image || '/og-image.jpg';

    return {
        title,
        description,
        alternates: {
            canonical: `/brands/${brand.slug}`,
        },
        openGraph: {
            title,
            description,
            type: 'website',
            url: `/brands/${brand.slug}`,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: brand.name,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
        },
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
