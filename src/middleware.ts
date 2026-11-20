import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bỏ qua tài nguyên tĩnh, API nội bộ, trang login, favicon, manifest
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/audio") ||
    pathname === "/login" ||
    pathname === "/login.html" ||
    pathname === "/manifest.json" ||
    pathname === "/sw.js" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Kiểm tra cookie ef_auth_user
  const authCookie = request.cookies.get("ef_auth_user");
  if (!authCookie || !authCookie.value) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|login.html|manifest.json|sw.js).*)"],
};
