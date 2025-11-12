import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;
	if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
		const token = req.cookies.get("admin_token")?.value;
		if (!token) {
			const url = new URL("/admin/login", req.url);
			return NextResponse.redirect(url);
		}
		return NextResponse.next();
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*"]
};


