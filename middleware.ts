import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the 'loggedin' cookie
  const loggedIn = request.cookies.get("loggedin")?.value;

  const { pathname } = request.nextUrl;

  // Define protected routes (User must be logged in)
  const protectedRoutes = ["/dashboard"];
  
  // Define public routes (User should NOT be here if already logged in)
  const authRoutes = ["/login", "/register"];

  // User tries to access Dashboard but is NOT logged in
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!loggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  //User tries to access Login/Register but IS already logged in
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (loggedIn) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  
  return NextResponse.next();
}


export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};