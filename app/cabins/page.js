import { Suspense } from "react";
import CabinList from "../_components/CabinList";
import Spinner from "../_components/Spinner";
import Filter from "../_components/Filter";
import SortBy from "../_components/SortBy";
import ReservationReminder from "../_components/ReservationReminder";
import { getRoomTypes, getHotel } from "../_lib/data-service";

export const revalidate = 0;

export const metadata = {
  title: "Cabins",
};

export default async function Page({ searchParams }) {
  const filter = searchParams?.capacity ?? "all";
  const sortBy = searchParams?.sortBy ?? "floor";
  const sortOrder = searchParams?.sortOrder ?? "asc";
  const page = searchParams?.page ?? "1";
  const roomType = searchParams?.roomType ?? "all";

  const [roomTypes, hotel] = await Promise.all([
    getRoomTypes(),
    getHotel(),
  ]);

  return (
    <div>
      <h1 className="text-4xl mb-5 text-accent-400 font-medium">
        {hotel?.name || "Our Luxury Rooms"}
      </h1>
      <p className="text-primary-200 text-lg mb-10">
        {hotel?.description ||
          "Cozy yet luxurious rooms, located in prime destinations worldwide. Imagine waking up to beautiful views, spending your days exploring vibrant cities, or just relaxing in our premium accommodations. Enjoy world-class hospitality in your home away from home. The perfect spot for a peaceful, memorable stay. Welcome to LuxeHotel."}
      </p>

      <div className="flex justify-between items-center mb-8">
        <Filter roomTypes={roomTypes} />
        <SortBy />
      </div>

      <Suspense fallback={<Spinner />} key={`${filter}-${sortBy}-${sortOrder}-${page}-${roomType}`}>
        <CabinList filter={filter} sortBy={sortBy} sortOrder={sortOrder} page={page} roomType={roomType} />
        <ReservationReminder />
      </Suspense>
    </div>
  );
}
