import { NextResponse } from 'next/server';

// Add paths that should be accessible without authentication
const publicPaths = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/live',
  '/blog',
  '/about',
  '/privacy',
  '/terms',
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  // Get the token from cookies
  const token = request.cookies.get('token')?.value;

  // If the path is public and user is logged in, allow access (don't redirect to dashboard)
  if (isPublicPath) {
    return NextResponse.next();
  }

  // If the path is protected and user is not logged in, redirect to login
  if (!isPublicPath && !token) {
    // Store the original URL to redirect back after login
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 