import { Suspense } from "react";
import CabinList from "../_components/CabinList";
import Spinner from "../_components/Spinner";
import Filter from "../_components/Filter";
import ReservationReminder from "../_components/ReservationReminder";

export const revalidate = 0;

export const metadata = {
  title: "Cabins",
};

export default function Page({ searchParams }) {
  const filter = searchParams?.capacity ?? "all";
  const sortBy = searchParams?.sortBy ?? "floor";
  const sortOrder = searchParams?.sortOrder ?? "asc";
  const page = searchParams?.page ?? "1";

  return (
    <div>
      <h1 className="text-4xl mb-5 text-accent-400 font-medium">
        Our Luxury Rooms
      </h1>
      <p className="text-primary-200 text-lg mb-10">
        Cozy yet luxurious rooms, located in prime destinations worldwide.
        Imagine waking up to beautiful views, spending your days exploring
        vibrant cities, or just relaxing in our premium accommodations. Enjoy
        world-class hospitality in your home away from home. The perfect spot
        for a peaceful, memorable stay. Welcome to LuxeHotel.
      </p>

      <div className="flex justify-end mb-8">
        <Filter />
      </div>

      <Suspense fallback={<Spinner />} key={`${filter}-${sortBy}-${sortOrder}-${page}`}>
        <CabinList filter={filter} sortBy={sortBy} sortOrder={sortOrder} page={page} />
        <ReservationReminder />
      </Suspense>
    </div>
  );
}
