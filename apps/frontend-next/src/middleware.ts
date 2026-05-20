import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authRoutes = ["/login", "/signup"];

const protectedRoutes = ["/feed", "/profile", "/feed", "/posts"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  if (token && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  // If the user is NOT authorized and try to enter the protected route
  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    // save the path where the user wanted to go so that he can return there after logging in
    const loginUrl = new URL("/login", request.url);
    // loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configuration to determine which paths to run Middleware on
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api (Next.js endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (icon)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
