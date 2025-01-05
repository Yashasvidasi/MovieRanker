import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken"; // Import the JWT library

// Replace this with your actual secret key
const SECRET_KEY = process.env.TOKEN_SECRET!;

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/login" || path === "/home";

  const token = request.cookies.get("token")?.value || "";

  if (path === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (isPublicPath) {
    return NextResponse.next();
  }

  if (token) {
    try {
      // Verify the token
      const fetchData = async () => {
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
        const response = await fetch(
          `${
            request.nextUrl.origin
          }/api/gettoken2?cachebuster=${new Date().getTime()}`,
          options
        );
        const data = await response.json();

        if (data.id !== "not_logged_in") {
          return NextResponse.redirect(new URL("/login", request.url));
        }
      };

      fetchData();
      // If token is valid, allow access to the path
      if (path.startsWith("/user")) {
        return NextResponse.next();
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      // Token verification failed, redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // No valid token or trying to access a protected route without a token, redirect to login
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/", "/home", "/user/:path*", "/login", "/user"], // Use wildcard for dynamic segments
};
