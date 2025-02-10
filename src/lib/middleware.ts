import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdminPath = req.nextUrl.pathname.startsWith("/dashboard/admins");
  const isUserPath = req.nextUrl.pathname.startsWith("/dashboard/users");
  const isDashboardRoot = req.nextUrl.pathname === "/dashboard";
  const userRole = req.auth?.user?.role?.name;

  // Si non connecté, redirection vers login
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirection depuis la racine du dashboard
  if (isDashboardRoot) {
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/admins", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard/users", req.url));
  }

  // Si admin essaie d'accéder au dashboard user
  if (userRole === "ADMIN" && isUserPath) {
    return NextResponse.redirect(new URL("/dashboard/admins", req.url));
  }

  // Si user normal essaie d'accéder au dashboard admin
  if (userRole !== "ADMIN" && isAdminPath) {
    return NextResponse.redirect(new URL("/dashboard/users", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register"
  ]
};