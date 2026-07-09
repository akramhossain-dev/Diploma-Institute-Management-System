import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read the lightweight entity indicator cookie
  const dimsEntity = request.cookies.get('dims_entity')?.value;

  // Protect Admin Panel
  if (pathname.startsWith('/admin')) {
    if (dimsEntity !== 'admin') {
      return NextResponse.redirect(new URL('/login/admin', request.url));
    }
  }

  // Protect Student Panel
  if (pathname.startsWith('/student')) {
    if (dimsEntity !== 'student') {
      return NextResponse.redirect(new URL('/login/student', request.url));
    }
  }

  // Protect Teacher Panel
  if (pathname.startsWith('/teacher')) {
    if (dimsEntity !== 'teacher') {
      return NextResponse.redirect(new URL('/login/teacher', request.url));
    }
  }

  // Protect Accountant Panel
  if (pathname.startsWith('/accountant')) {
    if (dimsEntity !== 'accountant') {
      return NextResponse.redirect(new URL('/login/accountant', request.url));
    }
  }

  // Redirect from login routes if already authenticated
  if (pathname === '/login' || pathname.startsWith('/login/')) {
    if (dimsEntity) {
      return NextResponse.redirect(new URL(`/${dimsEntity}/dashboard`, request.url));
    }
  }

  return NextResponse.next();
}

export default proxy;

// Config to specify matching route paths
export const config = {
  matcher: [
    '/admin/:path*',
    '/student/:path*',
    '/teacher/:path*',
    '/accountant/:path*',
    '/login/:path*',
    '/login',
  ],
};
