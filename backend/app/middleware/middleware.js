import { NextResponse } from "next/server";

export function middleware(request) {
  // Handle preflighted requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3001",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  // Pass request to next handler
  const response = NextResponse.next();

  // Add CORS headers to the response
  response.headers.set("Access-Control-Allow-Origin", "http://localhost:3001");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
