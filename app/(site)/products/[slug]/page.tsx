import React from 'react';
import { prisma } from "@/lib/prisma";
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
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

    const title = `${product.name} | Ruby Beauty`;
    const description = product.description || `Buy ${product.name} at Ruby Beauty.`;
    const mainImage = (product.images as string).split(',').map((img: string) => img.trim()).filter(Boolean)[0];

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            url: `https://ruby-beauty.com/products/${product.slug}`,
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
    console.log('SERVER: Rendering ProductPage for slug:', params.slug);
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

    return (
        <div className="grow w-full mx-auto container-custom py-4 lg:py-8">
            <Breadcrumbs
                productName={product.name}
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
                <div className="w-full lg:w-[41.5%] lg:sticky lg:top-[168px] self-start flex flex-col gap-1">
                    <div className="block">
                        <ProductHeader
                            name={product.name}
                            brandName={product.brand?.name}
                            categoryName={product.category?.name}
                            averageRating={averageRating}
                            totalReviews={totalReviews}
                        />
                    </div>

                    <ProductPrice
                        price={product.price.toString()}
                        discountPrice={product.discountPrice?.toString()}
                    />

                    <ProductActions
                        product={{
                            id: product.id,
                            name: product.name,
                            price: Number(product.discountPrice || product.price),
                            image: (product.images as string).split(',').map((img: string) => img.trim()).filter(Boolean)[0],
                            slug: product.slug
                        }}
                        stock={product.stock}
                    />

                    <ProductAccordions description={product.description} />

                    <div className="flex items-center justify-start mt-6 pt-6 border-t border-gray-100 dark:border-white/5 gap-3">
                        <span className="text-[13px] font-bold tracking-widest uppercase text-gray-400 mr-2">{language === 'ar' ? 'مشاركة:' : 'Share:'}</span>
                        <a
                            href="https://wa.me/963933254796"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FAFAFA] text-[#072835] hover:bg-[#072835] hover:text-white transition-all duration-300 shadow-sm border border-gray-100 dark:bg-white/5 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white dark:hover-underline-animated"
                        >
                            <FaWhatsapp className="text-lg" />
                        </a>
                        <a
                            href="https://www.instagram.com/ruby.beauty.sy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FAFAFA] text-[#072835] hover:bg-[#072835] hover:text-white transition-all duration-300 shadow-sm border border-gray-100 dark:bg-white/5 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white dark:hover-underline-animated"
                        >
                            <FaInstagram className="text-lg" />
                        </a>
                        <a
                            href="https://www.facebook.com/share/1HzXdo7sLG/?mibextid=wwXIfr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FAFAFA] text-[#072835] hover:bg-[#072835] hover:text-white transition-all duration-300 shadow-sm border border-gray-100 dark:bg-white/5 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white dark:hover-underline-animated"
                        >
                            <FaFacebook className="text-lg" />
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
        </div>
    );
}

export default ProductPage;
