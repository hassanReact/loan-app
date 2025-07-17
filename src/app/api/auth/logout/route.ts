import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL('/login', request.url);

  const response = NextResponse.redirect(url);

  response.cookies.set('token', '', { path: '/', maxAge: 0 });
  response.cookies.set('role', '', { path: '/', maxAge: 0 });
  response.cookies.set('userId', '', { path: '/', maxAge: 0 });

  return response;
}
