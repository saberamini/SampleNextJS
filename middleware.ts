import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Add custom middleware logic here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Protect these routes - requires authentication
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/protected/:path*',
  ],
};
