import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PLATFORM_SUBDOMAINS = new Set(['www', 'app', 'platform', 'admin', 'api']);

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const subdomain = extractSubdomain(host);

  // Pass through for platform-level domains (no subdomain, www, admin, etc.)
  if (!subdomain || PLATFORM_SUBDOMAINS.has(subdomain)) {
    return NextResponse.next();
  }

  // Look up hotel by subdomain via backend public endpoint
  try {
    const res = await fetch(
      `${BACKEND_URL}/public/hotels/by-subdomain/${subdomain}`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.rewrite(new URL('/not-found', request.url));
      }
      return NextResponse.next();
    }

    const hotel = await res.json();

    console.log(`[Middleware] Serving hotel: "${hotel.name}" (subdomain: ${hotel.subdomain}, id: ${hotel.id})`);

    // Attach hotel context to request headers for downstream consumption
    const headers = new Headers(request.headers);
    headers.set('x-hotel-id', hotel.id);
    headers.set('x-hotel-name', hotel.name);
    headers.set('x-hotel-subdomain', hotel.subdomain);
    headers.set('x-hotel-schema', hotel.schemaName);
    headers.set('x-hotel-timezone', hotel.timezone || 'UTC');
    headers.set('x-hotel-currency', hotel.currency || 'USD');
    headers.set('x-hotel-branding', JSON.stringify(hotel.branding || {}));

    const response = NextResponse.next({ request: { headers } });

    // Set cookies for client-side access (read-only, short-lived)
    response.cookies.set('hotel_id', hotel.id, {
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'lax',
    });
    response.cookies.set('hotel_name', hotel.name, {
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'lax',
    });

    return response;
  } catch {
    // Backend unreachable — fall through with default context
    return NextResponse.next();
  }
}

function extractSubdomain(host: string): string | null {
  const hostname = host.split(':')[0];

  // Localhost and IP — allow subdomain.localhost for dev testing
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return null;
  }

  const parts = hostname.split('.');

  // subdomain.localhost:3000 — for local development
  if (parts.length === 2 && parts[1] === 'localhost') {
    return parts[0];
  }

  // Requires at least 3 parts: subdomain.example.com
  if (parts.length < 3) return null;

  return parts[0];
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png|bg.png|about-\\d+\\.jpg).*)',
  ],
};
