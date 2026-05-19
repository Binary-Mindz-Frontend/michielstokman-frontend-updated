import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getCurrentUser } from './services/auth/auth.service';

export async function proxy(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;
  const userInfo = await getCurrentUser();
  const isAdmin = userInfo?.is_admin;

  const { pathname } = req.nextUrl;
  console.log('pathname', pathname);

  /* ===========================================================================
    IF LOGGED IN & TRYING TO ACCESS LOGIN PAGE REDIRECT TO DASHBOARD BASED ON ROLE
    =========================================================================== */
  if (token && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  /* ============================
     NOT LOGGED IN & TRYING TO ACCESS DASHBOARD REDIRECT TO HOME
     ============================ */
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  /* ============================
    BLOCK WRONG DASHBOARD ACCESS
    ============================ */
  if (token && pathname.startsWith('/dashboard')) {
    // ADMIN AREA
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
