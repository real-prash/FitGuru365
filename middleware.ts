import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Get the 'loggedin' cookie
  const loggedIn = request.cookies.get("loggedin")?.value;

  const { pathname } = request.nextUrl;

  // 2. Define protected routes (User must be logged in)
  const protectedRoutes = ["/dashboard"];
  
  // 3. Define public routes (User should NOT be here if already logged in)
  const authRoutes = ["/login", "/register"];

  // SCENARIO 1: User tries to access Dashboard but is NOT logged in
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!loggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // SCENARIO 2: User tries to access Login/Register but IS already logged in
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (loggedIn) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Allow the request to continue if no rules were broken
  return NextResponse.next();
}

// Configuration: Only run middleware on specific paths (optimizes performance)
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};