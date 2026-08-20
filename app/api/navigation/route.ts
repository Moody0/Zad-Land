import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const mainCategories = await prisma.mainCategory.findMany({
            where: { isActive: true, showInNav: true },
            orderBy: { navOrder: "asc" },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                image: true,
                brands: {
                    where: { isActive: true },
                    orderBy: { name: "asc" },
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        image: true,
                    },
                },
                categories: {
                    orderBy: { name: "asc" },
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        brand: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                image: true,
                                isActive: true,
                            },
                        },
                    },
                    take: 20,
                },
                products: {
                    orderBy: { createdAt: "desc" },
                    select: {
                        id: true,
                        name: true,
                        nameAr: true,
                        nameEn: true,
                        slug: true,
                        images: true,
                        price: true,
                        discountPrice: true,
                        isTrending: true,
                        brand: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                image: true,
                                isActive: true,
                            },
                        },
                    },
                    take: 30,
                },
            },
        });

        const result = mainCategories.map((mc) => {
            // Aggregate all active brands for this department:
            // 1. Direct brands (assigned to this MainCategory)
            // 2. Brands linked via categories in this MainCategory
            // 3. Brands linked via products in this MainCategory
            const brandMap = new Map<string, { id: string; name: string; slug: string; image?: string | null }>();

            for (const b of mc.brands) {
                brandMap.set(b.id, b);
            }

            for (const cat of mc.categories) {
                if (cat.brand && cat.brand.isActive && !brandMap.has(cat.brand.id)) {
                    brandMap.set(cat.brand.id, {
                        id: cat.brand.id,
                        name: cat.brand.name,
                        slug: cat.brand.slug,
                        image: cat.brand.image,
                    });
                }
            }

            for (const prod of mc.products) {
                if (prod.brand && prod.brand.isActive && !brandMap.has(prod.brand.id)) {
                    brandMap.set(prod.brand.id, {
                        id: prod.brand.id,
                        name: prod.brand.name,
                        slug: prod.brand.slug,
                        image: prod.brand.image,
                    });
                }
            }

            const aggregatedBrands = Array.from(brandMap.values()).sort((a, b) => a.name.localeCompare(b.name));

            // Separate trending products (max 3) from top products
            const trendingProducts = mc.products
                .filter((p) => p.isTrending)
                .slice(0, 3)
                .map((p) => ({
                    ...p,
                    price: Number(p.price),
                    discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
                }));

            // If we don't have 3 trending, fill with latest products
            const topProducts = mc.products
                .filter((p) => !trendingProducts.some((tp) => tp.id === p.id))
                .slice(0, 8)
                .map((p) => ({
                    id: p.id,
                    name: p.name,
                    nameAr: p.nameAr,
                    nameEn: p.nameEn,
                    slug: p.slug,
                }));

            // If trending < 3, pad with non-trending products
            if (trendingProducts.length < 3) {
                const remaining = mc.products
                    .filter((p) => !trendingProducts.some((tp) => tp.id === p.id))
                    .slice(0, 3 - trendingProducts.length)
                    .map((p) => ({
                        ...p,
                        price: Number(p.price),
                        discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
                    }));
                trendingProducts.push(...remaining);
            }

            return {
                id: mc.id,
                name: mc.name,
                nameEn: mc.description || mc.name,
                slug: mc.slug,
                image: mc.image,
                brands: aggregatedBrands,
                categories: mc.categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
                topProducts,
                trendingProducts: trendingProducts.slice(0, 3),
            };
        });

        const response = NextResponse.json(result);
        response.headers.set(
            "Cache-Control",
            "public, max-age=60, stale-while-revalidate=120"
        );
        return response;
    } catch (error) {
        console.error("Error fetching navigation data:", error);
        return NextResponse.json(
            { error: "Failed to fetch navigation data" },
            { status: 500 }
        );
    }
}
