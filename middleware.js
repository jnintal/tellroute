// middleware.js - Replace your entire middleware.js with this
import { NextResponse } from 'next/server';

// Simple middleware that doesn't break anything
export function middleware(request) {
  // Just let everything through for now
  return NextResponse.next();
}

// Only run on specific paths if needed
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};