// middleware.js
export function middleware(request) {
  const response = new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3001",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });

  // Handle OPTIONS preflight request
  if (request.method === "OPTIONS") {
    return response;
  }

  return response;
}

export const config = {
  matcher: "/api/:path*", // apply to all /api routes
};
