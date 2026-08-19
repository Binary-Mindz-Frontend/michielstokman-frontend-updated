import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getCurrentUser } from './services/auth/auth.service';

export async function proxy(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;
  const userInfo = await getCurrentUser();
  const isAdmin = userInfo?.is_admin;

  const { pathname } = req.nextUrl;

  /* ===========================================================================
    IF LOGGED IN & TRYING TO ACCESS LOGIN/REGISTER REDIRECT TO HOME
    =========================================================================== */
  if (token && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  /* ============================
     NOT LOGGED IN & TRYING TO ACCESS DASHBOARD REDIRECT TO HOME
     ============================ */
  if (!token && (pathname.startsWith('/dashboard') || pathname.startsWith('/user-dashboard'))) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  /* ============================
     REDIRECT REGULAR USER AWAY FROM ADMIN DASHBOARD TO USER DASHBOARD
     ============================ */
  if (token && pathname.startsWith('/dashboard') && !isAdmin) {
    return NextResponse.redirect(new URL('/user-dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/user-dashboard/:path*', '/login', '/register'],
};
