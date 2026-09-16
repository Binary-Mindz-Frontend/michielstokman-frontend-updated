import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getCurrentUser } from './services/auth/auth.service';

export async function proxy(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;
  const userInfo = await getCurrentUser();
  const isAdmin = userInfo?.is_admin;
  const isGuest = userInfo?.is_guest;

  const { pathname } = req.nextUrl;
  const isLiberationFlow = pathname.includes('/liberation');
  const requiresRegisteredUser =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/user-dashboard') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/create') ||
    isLiberationFlow;

  if (
    token &&
    !isGuest &&
    (pathname.startsWith('/login') ||
      pathname.startsWith('/register') ||
      pathname.startsWith('/forgot-password') ||
      pathname.startsWith('/reset-password'))
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!token && requiresRegisteredUser) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isGuest && requiresRegisteredUser && !pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/register', req.url));
  }

  if (token && pathname.startsWith('/dashboard') && !isAdmin) {
    return NextResponse.redirect(new URL('/user-dashboard', req.url));
  }

  if (token && isAdmin && pathname.startsWith('/user-dashboard')) {
    return NextResponse.redirect(new URL('/dashboard/publications', req.url));
  }

  if (token && isAdmin && (pathname === '/create' || pathname.startsWith('/create/'))) {
    const target = new URL('/dashboard/publications/create', req.url);
    const type = req.nextUrl.searchParams.get('type');
    if (type) target.searchParams.set('type', type);
    return NextResponse.redirect(target);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/user-dashboard/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/profile',
    '/profile/:path*',
    '/create',
    '/create/:path*',
    '/journeys/:path*',
  ],
};
