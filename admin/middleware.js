import { NextResponse } from "next/server";

const staticRoutes = ["/", "/domestic", "/spiritual", "/detail", "/contact", "/about", "/packages"];

export function middleware(request) {
  const token = request.cookies.get("admin_token")?.value;
  const { pathname } = request.nextUrl;

  if (staticRoutes.includes(pathname) || pathname.startsWith("/css/") || pathname.startsWith("/js/") || pathname.endsWith(".html")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
