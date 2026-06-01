import { notFound } from "next/navigation";
import { eachDayOfInterval } from "date-fns";

const cabins = [
  {
    id: 1,
    name: "001",
    maxCapacity: 2,
    regularPrice: 250,
    discount: 50,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
    description: "Discover the ultimate luxury retreat in our spacious room. Immerse yourself in breathtaking views while enjoying top-tier amenities. This room offers a perfect blend of modern comfort and elegant design, featuring a king-sized bed, marble bathroom, and smart home technology. Ideal for couples seeking a romantic getaway or business travelers."
  },
  {
    id: 2,
    name: "002",
    maxCapacity: 4,
    regularPrice: 350,
    discount: 0,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    description: "A beautiful suite for families or small groups. Enjoy stunning city views, a fully equipped kitchenette, and a private balcony. This spacious retreat features two bedrooms, a modern bathroom, and an open-plan living area."
  },
  {
    id: 3,
    name: "003",
    maxCapacity: 6,
    regularPrice: 450,
    discount: 100,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    description: "Our premium family suite offers ample space for up to six guests. With three bedrooms, two bathrooms, a large living area, and a fully equipped kitchen, this is the perfect home away from home."
  },
];

export async function getCabin(id) {
  const cabin = cabins.find(c => c.id === Number(id));
  if (!cabin) notFound();
  return cabin;
}

export async function getCabinPrice(id) {
  const cabin = cabins.find(c => c.id === Number(id));
  if (!cabin) return { regularPrice: 0, discount: 0 };
  return { regularPrice: cabin.regularPrice, discount: cabin.discount };
}

export const getCabins = async function () {
  return cabins.map(({ id, name, maxCapacity, regularPrice, discount, image }) => ({
    id, name, maxCapacity, regularPrice, discount, image,
  }));
};

export async function getGuest(email) {
  return null;
}

export async function getBooking(id) {
  return {
    id: Number(id),
    numGuests: 2,
    observations: "",
    cabinId: 1,
    maxCapacity: 2,
  };
}

export async function getBookings(guestId) {
  return [
    {
      id: 1,
      created_at: "2024-05-15T10:30:00Z",
      startDate: "2024-12-20T00:00:00Z",
      endDate: "2024-12-23T00:00:00Z",
      numNights: 3,
      numGuests: 2,
      totalPrice: 600,
      guestId: 1,
      cabinId: 1,
      cabins: {
        name: "001",
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=200",
      },
    },
    {
      id: 2,
      created_at: "2024-06-01T14:00:00Z",
      startDate: "2025-01-10T00:00:00Z",
      endDate: "2025-01-15T00:00:00Z",
      numNights: 5,
      numGuests: 4,
      totalPrice: 1750,
      guestId: 1,
      cabinId: 2,
      cabins: {
        name: "002",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200",
      },
    },
  ];
}

export async function getBookedDatesByCabinId(cabinId) {
  return [];
}

export async function getSettings() {
  return {
    minBookingLength: 1,
    maxBookingLength: 30,
  };
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

// Stub mutations
export async function createGuest(newGuest) {
  return newGuest;
}
