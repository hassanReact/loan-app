import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_ROUTES = ['/', '/login', '/register'];

async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    console.error('JWT verification failed:', err);
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // 2. Get token and role from cookies
  const token = req.cookies.get('token')?.value;
  const role = req.cookies.get('role')?.value;

  // 3. Frontend protection
  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 4. API protection
  if (pathname.startsWith('/api/')) {
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    // Optional: pass userId to downstream API routes (via headers)
    const requestHeaders = new Headers(req.headers);
    if (payload.userId) {
      requestHeaders.set('x-user-id', payload.userId.toString());
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/user/:path*',
    '/api/loan/:path*',
    '/api/admin/:path*',
  ],
    runtime: 'nodejs',
};
