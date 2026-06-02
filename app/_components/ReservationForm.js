"use client";

import { differenceInDays } from "date-fns";
import { useRouter } from "next/navigation";
import { useReservation } from "./ReservationContext";
import { createBooking } from "../_lib/data-service-shared";
import SubmitButton from "./SubmitButton";

function formatLocalDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getHotelId() {
  if (typeof document === "undefined") return null;
  const meta = document.querySelector('meta[name="x-hotel-id"]');
  return meta?.getAttribute("content") || null;
}

function ReservationForm({ cabin, user }) {
  const router = useRouter();
  const { range, resetRange } = useReservation();
  const { maxCapacity, regularPrice, discount, id } = cabin;

  const startDate = range.from;
  const endDate = range.to;

  const numNights = differenceInDays(endDate, startDate);
  const cabinPrice = numNights * (regularPrice - discount);

  async function handleBooking(formData) {
    const hotelId = getHotelId();
    if (!hotelId) {
      alert("Hotel configuration not found");
      return;
    }

    const numGuests = Number(formData.get("numGuests"));
    const observations = formData.get("observations") || "";

    if (!startDate || !endDate) return;

    try {
      console.log('[ReservationForm] Sending dates:', {
        startDate,
        endDate,
        checkIn: formatLocalDate(startDate),
        checkOut: formatLocalDate(endDate),
      });
      const result = await createBooking(
        {
          roomId: id,
          checkIn: formatLocalDate(startDate),
          checkOut: formatLocalDate(endDate),
          numGuests,
          notes: observations,
          firstName: user.name?.split(" ")[0] || "",
          lastName: user.name?.split(" ").slice(1).join(" ") || "",
          email: user.email || "",
        },
        hotelId,
      );

      resetRange();

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch (err) {
      alert(err.message || "Failed to create booking");
    }
  }

  return (
    <div className='flex h-full w-full flex-col'>
      <div className='bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center'>
        <p>Book as</p>

        <div className='flex gap-4 items-center'>
          <p>{user.name}</p>
        </div>
      </div>

      <form
        action={handleBooking}
        className='flex h-full w-full flex-1 flex-col gap-5 bg-primary-900 py-10 px-16 text-lg'
      >
        <div className='space-y-2'>
          <label htmlFor='numGuests'>How many guests?</label>
          <select
            name='numGuests'
            id='numGuests'
            className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm'
            required
          >
            <option value='' key=''>
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className='space-y-2'>
          <label htmlFor='observations'>
            Anything we should know about your stay?
          </label>
          <textarea
            name='observations'
            id='observations'
            className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm'
            placeholder='Any pets, allergies, special requirements, etc.?'
          />
        </div>

        <div className='flex justify-end items-center gap-6'>
          {!(startDate && endDate) ? (
            <p className='text-primary-300 text-base'>
              Start by selecting dates
            </p>
          ) : (
            <SubmitButton pendingLabel='Reserving...'>Reserve now</SubmitButton>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
