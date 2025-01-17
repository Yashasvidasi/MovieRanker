import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
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

      if (path.startsWith("/user")) {
        return NextResponse.next();
      }
    } catch (error) {
      console.error("Token verification failed:", error);

      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/", "/home", "/user/:path*", "/login", "/user"],
};
