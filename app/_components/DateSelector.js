"use client";

import { useState, useEffect, useCallback } from "react";
import {
  differenceInDays,
  isPast,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useReservation } from "./ReservationContext";
import { calculatePrice } from "../_lib/data-service-shared";

function formatLocalDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isAlreadyBooked(range, datesArr) {
  return (
    range.from &&
    range.to &&
    datesArr.some((date) =>
      isWithinInterval(date, { start: range.from, end: range.to }),
    )
  );
}

function DateSelector({ settings, cabin, bookedDates, hotelId }) {
  const { range, setRange, resetRange } = useReservation();

  const displayRange = isAlreadyBooked(range, bookedDates) ? {} : range;

  const { regularPrice, discount, id } = cabin;
  const numNights = differenceInDays(displayRange.to, displayRange.from);
  const simplePrice = numNights && numNights * (regularPrice - discount);

  const [priceData, setPriceData] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState(null);

  const fetchPrice = useCallback(async () => {
    if (!displayRange.from || !displayRange.to || !hotelId) return;
    setPriceLoading(true);
    setPriceError(null);
    try {
      const data = await calculatePrice({
        hotelId,
        roomId: id,
        checkIn: formatLocalDate(displayRange.from),
        checkOut: formatLocalDate(displayRange.to),
      });
      setPriceData(data);
    } catch (err) {
      setPriceError(err.message);
      setPriceData(null);
    } finally {
      setPriceLoading(false);
    }
  }, [displayRange.from, displayRange.to, hotelId, id]);

  useEffect(() => {
    fetchPrice();
  }, [fetchPrice]);

  const { minBookingLength, maxBookingLength } = settings;

  return (
    <div className='flex w-full flex-col justify-between'>
      <DayPicker
        className='w-full pt-12 place-self-center'
        mode='range'
        onSelect={setRange}
        selected={displayRange}
        min={minBookingLength + 1}
        max={maxBookingLength}
        fromMonth={new Date()}
        fromDate={new Date()}
        toYear={new Date().getFullYear() + 5}
        captionLayout='dropdown'
        numberOfMonths={2}
        disabled={(curDate) =>
          isPast(curDate) ||
          bookedDates.some((date) => isSameDay(date, curDate))
        }
      />

      <div className='bg-accent-500 text-primary-800'>
        <div className='flex items-center justify-between px-8 h-[72px]'>
          <div className='flex items-baseline gap-6'>
            <p className='flex gap-2 items-baseline'>
              {discount > 0 ? (
                <>
                  <span className='text-2xl'>${regularPrice - discount}</span>
                  <span className='line-through font-semibold text-primary-700'>
                    ${regularPrice}
                  </span>
                </>
              ) : (
                <span className='text-2xl'>${regularPrice}</span>
              )}
              <span className=''>/night</span>
            </p>
            {numNights ? (
              <>
                <p className='bg-accent-600 px-3 py-2 text-2xl'>
                  <span>&times;</span> <span>{numNights}</span>
                </p>
                <p>
                  <span className='text-lg font-bold uppercase'>Total</span>{" "}
                  <span className='text-2xl font-semibold'>
                    {priceLoading ? (
                      <span className='animate-pulse'>...</span>
                    ) : priceData ? (
                      `$${priceData.totalPrice}`
                    ) : (
                      `$${simplePrice}`
                    )}
                  </span>
                </p>
              </>
            ) : null}
          </div>

          {range.from || range.to ? (
            <button
              className='border border-primary-800 py-2 px-4 text-sm font-semibold'
              onClick={resetRange}
            >
              Clear
            </button>
          ) : null}
        </div>

        {priceData && priceData.hasDynamicPricing && (
          <div className='px-8 pb-3 space-y-1'>
            <div className='flex items-center gap-1.5 text-xs font-medium text-primary-700/80'>
              <svg className='w-3 h-3' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}><path strokeLinecap='round' strokeLinejoin='round' d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'/></svg>
              <span>Price breakdown by night:</span>
            </div>
            <div className='flex flex-wrap gap-1.5'>
              {priceData.nights.map((night, i) => (
                <div
                  key={i}
                  title={night.reason || `${night.date}`}
                  className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    night.factors.length > 0
                      ? "bg-amber-200 text-amber-900"
                      : "bg-primary-700/20 text-primary-700"
                  }`}
                >
                  ${night.price}
                  {night.factors.length > 0 && (
                    <span className='ml-1 opacity-70'>({night.factors.join(", ")})</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DateSelector;
