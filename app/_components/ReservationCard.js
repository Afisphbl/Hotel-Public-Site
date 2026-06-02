import Link from "next/link";
import Image from "next/image";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { format, formatDistance, isPast, isToday, parseISO } from "date-fns";
import DeleteReservation from "./DeleteReservation";

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  }).replace("about ", "");

function ReservationCard({ booking, onDelete }) {
  const {
    id,
    checkIn,
    checkOut,
    totalPrice,
    numGuests,
    status,
    createdAt,
    room,
  } = booking;

  const roomName = room?.name || "N/A";
  const roomImage = room?.image || null;
  const checkInDate = parseISO(checkIn);
  const checkOutDate = parseISO(checkOut);
  const numNights = Math.round((checkOutDate - checkInDate) / 86400000);

  return (
    <div className="flex border border-primary-800">
      <div className="relative h-32 aspect-square">
        {roomImage ? (
          <Image
            src={roomImage}
            alt={`Room ${roomName}`}
            fill
            className="object-cover border-r border-primary-800"
          />
        ) : (
          <div className="w-full h-full bg-primary-800 border-r border-primary-800 flex items-center justify-center text-primary-500 font-bold text-lg">
            {roomName.slice(0, 2)}
          </div>
        )}
      </div>

      <div className="flex-grow px-6 py-3 flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {numNights} {numNights === 1 ? "night" : "nights"} in Room {roomName}
          </h3>
          {isPast(checkInDate) ? (
            <span className="bg-yellow-800 text-yellow-200 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-sm">
              past
            </span>
          ) : (
            <span className="bg-green-800 text-green-200 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-sm">
              upcoming
            </span>
          )}
        </div>

        <p className="text-lg text-primary-300">
          {format(checkInDate, "EEE, MMM dd yyyy")} (
          {isToday(checkInDate)
            ? "Today"
            : formatDistanceFromNow(checkIn)}
          ) &mdash; {format(checkOutDate, "EEE, MMM dd yyyy")}
        </p>

        <div className="flex gap-5 mt-auto items-baseline">
          <p className="text-xl font-semibold text-accent-400">${Number(totalPrice).toFixed(0)}</p>
          <p className="text-primary-300">&bull;</p>
          <p className="text-lg text-primary-300">
            {numGuests} guest{numGuests > 1 && "s"}
          </p>
          <p className="ml-auto text-sm text-primary-400">
            Booked {format(parseISO(createdAt), "EEE, MMM dd yyyy, p")}
          </p>
        </div>
      </div>

      <div className="flex flex-col border-l border-primary-800 w-[100px]">
        {!isPast(checkInDate) ? (
          <>
            <Link
              href={`/account/reservations/edit/${id}`}
              className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 border-b border-primary-800 flex-grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900"
            >
              <PencilSquareIcon className="h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-colors" />
              <span className="mt-1">Edit</span>
            </Link>
            <DeleteReservation bookingId={id} onDelete={onDelete} />
          </>
        ) : null}
      </div>
    </div>
  );
}

export default ReservationCard;
