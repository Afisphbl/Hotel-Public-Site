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
        return new NextResponse(
          `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Hotel Not Found</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f1b2d; color: #e0d5c1; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
  .container { text-align: center; max-width: 480px; padding: 2rem; }
  h1 { font-size: 2rem; margin-bottom: 1rem; color: #c9973a; }
  p { font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem; }
  .subdomain { font-weight: 600; color: #c9973a; }
</style>
</head>
<body>
  <div class="container">
    <h1>Hotel Not Found</h1>
    <p>There is no hotel website associated with <span class="subdomain">${subdomain}</span>.<br>Please check the URL and try again.</p>
  </div>
</body>
</html>`,
          { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
        );
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
