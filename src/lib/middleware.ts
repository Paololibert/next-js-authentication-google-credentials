import { NextResponse } from "next/server";
//import { auth } from "@/lib/auth";
export { auth as middleware } from "@/lib/auth"

/* export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdminPath = req.nextUrl.pathname.startsWith("/dashboard/admins");
  const isUserPath = req.nextUrl.pathname.startsWith("/dashboard/users");
  const isDashboardRoot = req.nextUrl.pathname === "/dashboard";
  const userRole = req.auth?.user?.role?.name;

  // Si non connecté, redirection vers login
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirection from the dashboard root
  if (isDashboardRoot) {
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/admins", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard/users", req.url));
  }

  // If admin tries to access the user dashboard
  if (userRole === "ADMIN" && isUserPath) {
    return NextResponse.redirect(new URL("/dashboard/admins", req.url));
  }

  // If normal user tries to access the admin dashboard
  if (userRole !== "ADMIN" && isAdminPath || userRole !== "USER" && isUserPath) {
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
}; */