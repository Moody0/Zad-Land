import React from 'react';
import { prisma } from "@/lib/prisma";
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductGallery from '@/app/components/ProductDetailsComponents/ProductGallery';
import ProductHeader from '@/app/components/ProductDetailsComponents/ProductHeader';
import ProductPrice from '@/app/components/ProductDetailsComponents/ProductPrice';
import ProductActions from '@/app/components/ProductDetailsComponents/ProductActions';
import ProductAccordions from '@/app/components/ProductDetailsComponents/ProductAccordions';
import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';
import RelatedProducts from '@/app/components/ProductDetailsComponents/RelatedProducts';
import Breadcrumbs from '@/app/components/ProductDetailsComponents/Breadcrumbs';
import ProductReviews from '@/app/components/ProductDetailsComponents/ProductReviews';
import { cookies } from 'next/headers';

export async function generateMetadata(
    props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const params = await props.params;
    const product = await prisma.product.findFirst({
        where: {
            slug: params.slug,
            brand: { isActive: true },
        },
        include: {
            brand: true,
        },
    });

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    const title = `${product.name} | Zad Land`;
    const description = product.description || `Buy ${product.name} at Zad Land.`;
    const mainImage = (product.images as string).split(',').map((img: string) => img.trim()).filter(Boolean)[0];

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            images: [
                {
                    url: mainImage,
                    width: 1200,
                    height: 630,
                    alt: product.name,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [mainImage],
        },
    };
}

const ProductPage = async (props: { params: Promise<{ slug: string }> }) => {
    const params = await props.params;
    const cookieStore = await cookies();
    const language = cookieStore.get('language')?.value || 'ar';

    const product = await prisma.product.findFirst({
        where: {
            slug: params.slug,
            brand: { isActive: true },
        },
        include: {
            brand: true,
            category: true,
        },
    });

    if (!product) {
        notFound();
    }

    // Fetch related products (same category, exclude current)
    const relatedProducts = await prisma.product.findMany({
        where: {
            categoryId: product.categoryId,
            id: { not: product.id },
            brand: { isActive: true },
        },
        take: 4,
    });

    // Fetch review statistics
    const reviewStats = await prisma.review.aggregate({
        where: { productId: product.id, isApproved: true },
        _avg: { rating: true },
        _count: { id: true },
    });
    
    const averageRating = reviewStats._avg.rating || 0;
    const totalReviews = reviewStats._count.id || 0;

    const displayName = (language === 'ar' ? product.nameAr : product.nameEn) || product.name || product.nameAr || '';

    return (
        <main className="grow w-full mx-auto container-custom py-4 lg:py-8">
            <Breadcrumbs
                productName={displayName}
                categoryName={product.category?.name}
                categorySlug={product.category?.slug}
            />

            <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 w-full mt-6">
                {/* Product Gallery (Left) */}
                <div className="w-full lg:w-[58.5%] flex-shrink-0 relative">
                    <ProductGallery
                        images={product.images}
                        isTrending={product.isTrending}
                    />
                </div>

                {/* Product Details (Right) */}
                <div className="w-full lg:w-[41.5%] lg:sticky lg:top-[140px] self-start flex flex-col gap-1">
                    <ProductHeader
                        name={product.name}
                        nameAr={product.nameAr}
                        nameEn={product.nameEn}
                        brandName={product.brand?.name}
                        categoryName={product.category?.name}
                        averageRating={averageRating}
                        totalReviews={totalReviews}
                    />

                    <ProductPrice
                        price={product.price.toString()}
                        discountPrice={product.discountPrice?.toString()}
                    />

                    <ProductActions
                        product={{
                            id: product.id,
                            name: product.name,
                            nameAr: product.nameAr,
                            nameEn: product.nameEn,
                            price: Number(product.discountPrice || product.price),
                            image: (product.images as string).split(',').map((img: string) => img.trim()).filter(Boolean)[0],
                            slug: product.slug,
                            options: product.options,
                            description: product.description,
                            descriptionAr: product.descriptionAr,
                            descriptionEn: product.descriptionEn,
                        }}
                        stock={product.stock}
                    />

                    <ProductAccordions 
                        description={product.description}
                        descriptionAr={product.descriptionAr}
                        descriptionEn={product.descriptionEn}
                        options={product.options}
                    />

                    {/* Social Share */}
                    <div className="flex items-center justify-start mt-6 pt-6 border-t border-gray-200 dark:border-white/10 gap-3">
                        <span className="text-xs font-bold tracking-widest uppercase text-gray-400 mr-2">
                            {language === 'ar' ? 'مشاركة:' : 'Share:'}
                        </span>
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-zinc-900 dark:bg-zinc-800 dark:text-white hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                            aria-label="Share on WhatsApp"
                        >
                            <FaWhatsapp className="text-base" />
                        </a>
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-zinc-900 dark:bg-zinc-800 dark:text-white hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                            aria-label="Share on Instagram"
                        >
                            <FaInstagram className="text-base" />
                        </a>
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-zinc-900 dark:bg-zinc-800 dark:text-white hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                            aria-label="Share on Facebook"
                        >
                            <FaFacebook className="text-base" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Product Reviews Anchor */}
            <div id="product-reviews" className="scroll-mt-32">
                <RelatedProducts products={relatedProducts.map(p => ({
                    ...p,
                    price: Number(p.price),
                    discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
                    discountType: p.discountType,
                    discountValue: p.discountValue ? Number(p.discountValue) : null,
                    createdAt: p.createdAt.toISOString(),
                    updatedAt: p.updatedAt.toISOString(),
                }))} />

                <ProductReviews
                    productId={product.id}
                    productName={product.name}
                    productImage={(product.images as string).split(',').map((img: string) => img.trim()).filter(Boolean)[0]}
                />
            </div>
        </main>
    );
}

export default ProductPage;
