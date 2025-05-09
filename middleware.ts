import { NextResponse } from 'next/server';
import { authMiddleware } from '@clerk/nextjs/server';

export default authMiddleware({
  publicRoutes: ['/ping', '/login', '/register'],
  afterAuth(auth, req) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith('/ping')) {
      return new Response('pong', { status: 200 });
    }

    // Redirect to login if not authenticated
    if (!auth.userId && !pathname.startsWith('/login') && !pathname.startsWith('/register')) {
      const redirectUrl = encodeURIComponent(req.url);
      return NextResponse.redirect(
        new URL(`/login?redirect_url=${redirectUrl}`, req.url),
      );
    }

    // Redirect authenticated users away from auth pages
    if (auth.userId && ['/login', '/register'].includes(pathname)) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  }
});

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
