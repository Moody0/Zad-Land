import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const { pathname, search } = req.nextUrl;

    // Only protect /admin routes (except /admin/login)
    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
        const hasSessionToken =
            req.cookies.has("__Secure-next-auth.session-token") ||
            req.cookies.has("next-auth.session-token") ||
            req.cookies.has("__Secure-next-auth.session-token.0") ||
            req.cookies.has("next-auth.session-token.0");

        if (!hasSessionToken) {
            const loginUrl = new URL("/admin/login", req.url);
            loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
