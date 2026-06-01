import { headers } from 'next/headers';

export interface HotelContext {
  id: string;
  name: string;
  subdomain: string;
  schema: string;
  timezone: string;
  currency: string;
  branding: {
    primaryColor?: string;
    accentColor?: string;
    logo?: string;
    favicon?: string;
  };
}

export function getHotelFromHeaders(): HotelContext | null {
  const h = headers();

  const id = h.get('x-hotel-id');
  if (!id) return null;

  let branding = {};
  try {
    const raw = h.get('x-hotel-branding');
    if (raw) branding = JSON.parse(raw);
  } catch {
    // ignore parse errors
  }

  return {
    id,
    name: h.get('x-hotel-name') || '',
    subdomain: h.get('x-hotel-subdomain') || '',
    schema: h.get('x-hotel-schema') || '',
    timezone: h.get('x-hotel-timezone') || 'UTC',
    currency: h.get('x-hotel-currency') || 'USD',
    branding,
  };
}
