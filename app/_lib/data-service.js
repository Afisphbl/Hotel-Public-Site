import { headers } from "next/headers";
import { notFound } from "next/navigation";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

function getHotelId() {
  try {
    const h = headers();
    const id = h.get("x-hotel-id");
    if (id) return id;
  } catch {
    // headers() throws during build time (generateStaticParams), fall through
  }
  const fallback = process.env.NEXT_PUBLIC_FALLBACK_HOTEL_ID;
  if (fallback) return fallback;
  return null;
}

function mapRoomToCabin(room) {
  const basePrice =
    room.basePrice != null
      ? Number(room.basePrice)
      : room.roomType?.basePrice != null
        ? Number(room.roomType.basePrice)
        : 0;
  const effectivePrice =
    room.effectivePrice != null ? Number(room.effectivePrice) : basePrice;

  const regularPrice = Math.max(basePrice, effectivePrice);
  const discount = effectivePrice < basePrice ? basePrice - effectivePrice : 0;

  return {
    id: room.id,
    name: room.roomNumber,
    maxCapacity: room.baseCapacity || room.roomType?.baseCapacity || 2,
    regularPrice,
    discount,
    image:
      room.images?.[0] ||
      room.roomType?.image ||
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
    description:
      room.roomType?.description ||
      "A comfortable room designed for your perfect stay.",
    floor: room.floor,
    roomTypeName: room.roomType?.name || "",
    roomTypeId: room.roomTypeId,
    effectivePrice,
    basePrice,
  };
}

export async function getRoomTypes() {
  const hotelId = getHotelId();
  if (!hotelId) return [];
  const res = await fetch(
    `${BACKEND_URL}/public/room-types?hotelId=${encodeURIComponent(hotelId)}`,
    { cache: "no-store" },
  );
  if (!res.ok) return [];
  return res.json();
}

export async function getHotel() {
  const hotelId = getHotelId();
  if (!hotelId) return null;
  const res = await fetch(
    `${BACKEND_URL}/public/hotels/by-id/${encodeURIComponent(hotelId)}`,
    { cache: "no-store" },
  );
  if (!res.ok) return null;
  return res.json();
}

export async function getCabins({ filter, sortBy, sortOrder, page, roomType } = {}) {
  const hotelId = getHotelId();
  if (!hotelId) return { items: [], total: 0, page: 1, limit: 12, totalPages: 0 };

  const params = new URLSearchParams({ hotelId });
  if (filter === "small") {
    params.set("minCapacity", "1");
    params.set("maxCapacity", "3");
  } else if (filter === "medium") {
    params.set("minCapacity", "4");
    params.set("maxCapacity", "7");
  } else if (filter === "large") {
    params.set("minCapacity", "8");
  }
  if (sortBy) params.set("sortBy", sortBy);
  if (sortOrder) params.set("sortOrder", sortOrder);
  if (page) params.set("page", String(page));
  if (roomType && roomType !== "all") params.set("roomTypeId", roomType);

  const res = await fetch(
    `${BACKEND_URL}/public/rooms?${params.toString()}`,
    { cache: "no-store" },
  );
  if (!res.ok) return { items: [], total: 0, page: 1, limit: 12, totalPages: 0 };
  const data = await res.json();

  const rawItems = Array.isArray(data) ? data : (data.items || []);
  const rawTotal = Array.isArray(data) ? data.length : (data.total ?? rawItems.length);

  return {
    items: rawItems.map(mapRoomToCabin),
    total: rawTotal,
    page: data.page ?? 1,
    limit: data.limit ?? 12,
    totalPages: data.totalPages ?? Math.ceil(rawTotal / 12),
  };
}

export async function getCabin(id) {
  const hotelId = getHotelId();
  if (!hotelId) notFound();
  const res = await fetch(
    `${BACKEND_URL}/public/rooms/${encodeURIComponent(id)}?hotelId=${encodeURIComponent(hotelId)}`,
    { cache: "no-store" },
  );
  if (!res.ok) notFound();
  const room = await res.json();
  return mapRoomToCabin(room);
}

export async function getCabinPrice(id) {
  const hotelId = getHotelId();
  if (!hotelId) return { regularPrice: 0, discount: 0 };
  const res = await fetch(
    `${BACKEND_URL}/public/rooms/${encodeURIComponent(id)}?hotelId=${encodeURIComponent(hotelId)}`,
    { cache: "no-store" },
  );
  if (!res.ok) return { regularPrice: 0, discount: 0 };
  const room = await res.json();
  const cabin = mapRoomToCabin(room);
  return { regularPrice: cabin.regularPrice, discount: cabin.discount };
}

export async function getBookedDatesByCabinId(cabinId) {
  const hotelId = getHotelId();
  if (!hotelId) return [];
  const today = new Date().toISOString().split("T")[0];
  const future = new Date(Date.now() + 365 * 86400000).toISOString().split("T")[0];

  const res = await fetch(
    `${BACKEND_URL}/public/rooms/booked-dates?hotelId=${encodeURIComponent(hotelId)}&roomId=${encodeURIComponent(cabinId)}&startDate=${today}&endDate=${future}`,
    { cache: "no-store" },
  );
  if (!res.ok) return [];
  const dates = await res.json();
  return dates.map((d) => {
    const [y, m, day] = d.split('-').map(Number);
    return new Date(y, m - 1, day);
  });
}

export async function getSettings() {
  return {
    minBookingLength: 1,
    maxBookingLength: 30,
  };
}

export async function getGuest(email) {
  return null;
}

export async function getBooking(id) {
  const res = await fetch(`${BACKEND_URL}/public/bookings/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    return {
      id: Number(id),
      numGuests: 2,
      observations: "",
      cabinId: "",
      maxCapacity: 2,
    };
  }
  const data = await res.json();
  return {
    id: data.id,
    numGuests: data.numGuests,
    observations: data.observations || "",
    cabinId: data.cabinId || data.roomId,
    maxCapacity: data.maxCapacity || 2,
  };
}

export async function getBookings(guestId) {
  return [];
}

export async function getCountries() {
  try {
    const res = await fetch("https://restcountries.com/v2/all?fields=name,flag");
    const countries = await res.json();
    return countries;
  } catch {
    throw new Error("Could not fetch countries");
  }
}

export async function createGuest(newGuest) {
  return newGuest;
}
