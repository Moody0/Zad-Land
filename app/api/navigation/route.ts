import { NextResponse } from "next/server";
import { getNavigationData } from "@/lib/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
    try {
        const result = await getNavigationData();
        const response = NextResponse.json(result);
        response.headers.set(
            "Cache-Control",
            "no-store, no-cache, must-revalidate, proxy-revalidate"
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
