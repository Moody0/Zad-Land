import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { productId, rating, feedback, image, name, email } = body;

        if (!productId || !rating || !name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const review = await prisma.review.create({
            data: {
                productId,
                rating,
                feedback,
                image,
                name,
                email,
                isApproved: false, // Default to false
            }
        });

        return NextResponse.json({ success: true, review }, { status: 201 });
    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const productId = searchParams.get("productId");

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        const reviews = await prisma.review.findMany({
            where: {
                productId,
                isApproved: true,
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const response = NextResponse.json(reviews);
        response.headers.set(
            "Cache-Control",
            "public, s-maxage=300, stale-while-revalidate=3600"
        );
        return response;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
}
