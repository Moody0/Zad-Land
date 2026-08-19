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
                    },
                    take: 10,
                },
                categories: {
                    orderBy: { name: "asc" },
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                    take: 10,
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
                                name: true,
                            },
                        },
                    },
                    take: 20,
                },
            },
        });

        const result = mainCategories.map((mc) => {
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
                brands: mc.brands,
                categories: mc.categories,
                topProducts,
                trendingProducts: trendingProducts.slice(0, 3),
            };
        });

        const response = NextResponse.json(result);
        response.headers.set(
            "Cache-Control",
            "public, max-age=300, stale-while-revalidate=600"
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
