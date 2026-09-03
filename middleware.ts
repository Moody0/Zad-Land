import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const { pathname, search } = req.nextUrl;

    // Only inspect /admin routes
    if (pathname.startsWith("/admin")) {
        const isLoginPage = pathname === "/admin/login";

        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });

        // If not logged in and trying to access protected admin route, redirect to login
        if (!token && !isLoginPage) {
            const loginUrl = new URL("/admin/login", req.url);
            loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
            return NextResponse.redirect(loginUrl);
        }

        // If already logged in and visiting login page, redirect to dashboard
        if (token && isLoginPage) {
            return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
