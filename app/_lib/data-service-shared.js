export const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function createReview(reviewData, token) {
  const res = await fetch(`${BACKEND_URL}/public/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reviewData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create review");
  }

  return res.json();
}

export async function createBooking(bookingData, hotelId) {
  const res = await fetch(`${BACKEND_URL}/public/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hotel-id": hotelId,
    },
    body: JSON.stringify(bookingData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create booking");
  }

  return res.json();
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
