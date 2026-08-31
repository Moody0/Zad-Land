import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
    try {
        const trendingProducts = await prisma.product.findMany({
            where: {
                isTrending: true,
            },
            include: {
                category: true,
            },
        });

        const response = NextResponse.json(trendingProducts.map(p => ({
            ...p,
            price: p.price.toString(),
            discountPrice: p.discountPrice ? p.discountPrice.toString() : null,
            discountType: p.discountType,
            discountValue: p.discountValue ? p.discountValue.toString() : null
        })));
        response.headers.set(
            "Cache-Control",
            "public, s-maxage=3600, stale-while-revalidate=86400"
        );
        return response;
    } catch (error) {
        console.error("Error fetching trending products:", error);
        return NextResponse.json(
            { error: "Failed to fetch trending products" },
            { status: 500 }
        );
    }
}
