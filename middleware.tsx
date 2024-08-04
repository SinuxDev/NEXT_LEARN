import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  return NextResponse.redirect(new URL("/", req.url).toString());
}

export const config = {
  matcher: "/about/:path*",
};
