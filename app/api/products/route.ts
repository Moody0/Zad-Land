import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const requestedLimit = parseInt(searchParams.get("limit") || "12");
        const limit = Math.max(1, Math.min(requestedLimit || 12, 12)); // default/cap at 12
        const sort = searchParams.get("sort");
        const categoryIdsParam = searchParams.get("categoryIds");
        const brandIdsParam = searchParams.get("brandIds");
        const mainCategoryIdParam = searchParams.get("mainCategoryId");
        const search = searchParams.get("search");

        const skip = (page - 1) * limit;

        const where: Prisma.ProductWhereInput = {
            brand: {
                isActive: true,
            },
        };
        if (categoryIdsParam) {
            const ids = categoryIdsParam.split(",").filter(Boolean);
            if (ids.length > 0) {
                where.categoryId = { in: ids };
            }
        }

        if (brandIdsParam) {
            const ids = brandIdsParam.split(",").filter(Boolean);
            if (ids.length > 0) {
                where.brandId = { in: ids };
            }
        }

        if (mainCategoryIdParam) {
            where.mainCategoryId = mainCategoryIdParam;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { nameAr: { contains: search, mode: "insensitive" } },
                { nameEn: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { descriptionAr: { contains: search, mode: "insensitive" } },
                { descriptionEn: { contains: search, mode: "insensitive" } },
            ];
        }

        let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
        if (sort === "price_asc") {
            orderBy = { price: "asc" };
        } else if (sort === "price_desc") {
            orderBy = { price: "desc" };
        } else if (sort === "newest") {
            orderBy = { createdAt: "desc" };
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                select: {
                    id: true,
                    name: true,
                    nameAr: true,
                    nameEn: true,
                    description: true,
                    descriptionAr: true,
                    descriptionEn: true,
                    slug: true,
                    images: true,
                    price: true,
                    discountPrice: true,
                    discountType: true,
                    discountValue: true,
                    stock: true,
                    options: true,
                    isTrending: true,
                    brandId: true,
                    categoryId: true,
                    mainCategoryId: true,
                    brand: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            group: true,
                        }
                    },
                    category: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            }),
            prisma.product.count({ where }),
        ]);

        const response = NextResponse.json({
            products: products.map(p => ({
                ...p,
                price: p.price.toString(),
                discountPrice: p.discountPrice ? p.discountPrice.toString() : null,
                discountType: p.discountType,
                discountValue: p.discountValue ? p.discountValue.toString() : null,
            })),
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit,
            },
        });
        
        // Add cache headers
        response.headers.set('Cache-Control', 'private, max-age=60, stale-while-revalidate=300');
        return response;
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}
