import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export async function GET() {
    try {
        const mainCategories = await prisma.mainCategory.findMany({
            where: { isActive: true },
            orderBy: { name: "asc" },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                image: true,
            },
        });

        const response = NextResponse.json(mainCategories);
        response.headers.set(
            "Cache-Control",
            "public, s-maxage=3600, stale-while-revalidate=86400"
        );
        return response;
    } catch (error) {
        console.error("Error fetching main categories:", error);
        return NextResponse.json(
            { error: "Failed to fetch main categories" },
            { status: 500 }
        );
    }
}
