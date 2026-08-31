import { NextResponse } from "next/server";
import { getNavigationData } from "@/lib/navigation";

export const revalidate = 3600;

export async function GET() {
    try {
        const result = await getNavigationData();
        const response = NextResponse.json(result);
        response.headers.set(
            "Cache-Control",
            "public, s-maxage=3600, stale-while-revalidate=86400"
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
