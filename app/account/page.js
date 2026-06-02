import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getGuestProfile, getGuestBookings } from "@/app/_lib/data-service";
import { format, parseISO, isPast, isToday, formatDistance } from "date-fns";

export const metadata = {
  title: "My Account",
};

function formatDistanceFromNow(dateStr) {
  return formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  }).replace("about ", "");
}

function StatusBadge({ status, startDate }) {
  if (isPast(new Date(startDate))) {
    return (
      <span className="bg-yellow-800 text-yellow-200 px-3 py-1 uppercase text-xs font-bold rounded-sm">
        past
      </span>
    );
  }
  if (status === "confirmed" || status === "checked_in") {
    return (
      <span className="bg-green-800 text-green-200 px-3 py-1 uppercase text-xs font-bold rounded-sm">
        upcoming
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="bg-orange-800 text-orange-200 px-3 py-1 uppercase text-xs font-bold rounded-sm">
        pending
      </span>
    );
  }
  if (status === "cancelled") {
    return (
      <span className="bg-red-800 text-red-200 px-3 py-1 uppercase text-xs font-bold rounded-sm">
        cancelled
      </span>
    );
  }
  return (
    <span className="bg-blue-800 text-blue-200 px-3 py-1 uppercase text-xs font-bold rounded-sm">
      {status}
    </span>
  );
}

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) redirect("/login");

  const [profile, bookings] = await Promise.all([
    getGuestProfile(session.accessToken),
    getGuestBookings(session.accessToken),
  ]);

  const firstName = profile?.firstName || session.user?.fullName?.split(" ")[0] || "back";
  const upcoming = bookings?.filter(
    (b) => !isPast(parseISO(b.checkIn)) && b.status !== "cancelled"
  ) || [];
  const recent = bookings?.slice(0, 5) || [];
  const totalStays = bookings?.length || 0;
  const totalSpent = bookings?.reduce((sum, b) => sum + Number(b.totalPrice || 0), 0) || 0;
  const totalNights = bookings?.reduce((sum, b) => {
    const checkIn = parseISO(b.checkIn);
    const checkOut = parseISO(b.checkOut);
    return sum + Math.round((checkOut - checkIn) / 86400000);
  }, 0) || 0;

  const stats = [
    { label: "Total stays", value: totalStays },
    { label: "Nights booked", value: totalNights },
    { label: "Total spent", value: `$${totalSpent.toFixed(0)}` },
    { label: "Upcoming", value: upcoming.length },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-semibold text-2xl text-accent-400">
            Welcome back, {firstName}!
          </h2>
          <p className="text-primary-300 text-base mt-1">
            {profile?.email || session.user?.email}
          </p>
        </div>
        {profile?.isVip && (
          <span className="bg-accent-500 text-primary-800 px-4 py-1 uppercase text-xs font-bold rounded-sm">
            VIP Member
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-primary-900 border border-primary-800 rounded-sm px-5 py-4"
          >
            <p className="text-3xl font-bold text-accent-400">{stat.value}</p>
            <p className="text-primary-400 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {upcoming.length > 0 && (
        <div className="mb-10">
          <h3 className="font-semibold text-xl text-accent-400 mb-4">
            Next stay
          </h3>
          <div className="bg-primary-900 border border-primary-800 rounded-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold text-primary-100">
                  Room {upcoming[0].room?.name || "N/A"}
                </p>
                <p className="text-primary-400 text-sm">
                  {upcoming[0].room?.roomTypeName || ""}
                </p>
              </div>
              <StatusBadge
                status={upcoming[0].status}
                startDate={upcoming[0].checkIn}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-primary-400">Check in</p>
                <p className="text-primary-100 font-semibold">
                  {format(parseISO(upcoming[0].checkIn), "MMM dd, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-primary-400">Check out</p>
                <p className="text-primary-100 font-semibold">
                  {format(parseISO(upcoming[0].checkOut), "MMM dd, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-primary-400">Total</p>
                <p className="text-primary-100 font-semibold">
                  ${Number(upcoming[0].totalPrice).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Link
                href={`/account/reservations/edit/${upcoming[0].id}`}
                className="bg-accent-500 text-primary-800 px-4 py-2 text-sm font-semibold rounded-sm hover:bg-accent-600 transition-colors"
              >
                Edit booking
              </Link>
              <Link
                href="/account/reservations"
                className="border border-primary-600 text-primary-200 px-4 py-2 text-sm font-semibold rounded-sm hover:bg-primary-800 transition-colors"
              >
                View all
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-xl text-accent-400">
            Recent reservations
          </h3>
          <Link
            href="/account/reservations"
            className="text-sm text-accent-400 underline hover:text-accent-300"
          >
            View all &rarr;
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="bg-primary-900 border border-primary-800 rounded-sm p-8 text-center">
            <p className="text-primary-300 mb-4">
              You have no reservations yet.
            </p>
            <Link
              href="/cabins"
              className="bg-accent-500 text-primary-800 px-6 py-3 font-semibold rounded-sm hover:bg-accent-600 transition-colors inline-block"
            >
              Browse rooms
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map((booking) => (
              <div
                key={booking.id}
                className="bg-primary-900 border border-primary-800 rounded-sm px-5 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-800 rounded-sm flex items-center justify-center text-primary-400 font-bold text-sm">
                    {booking.room?.name?.replace(/\D/g, "").slice(0, 2) || "RM"}
                  </div>
                  <div>
                    <p className="text-primary-100 font-semibold">
                      Room {booking.room?.name || "N/A"}
                    </p>
                    <p className="text-primary-400 text-xs">
                      {format(parseISO(booking.checkIn), "MMM dd")} &mdash;{" "}
                      {format(parseISO(booking.checkOut), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-primary-100 font-semibold">
                    ${Number(booking.totalPrice).toFixed(2)}
                  </span>
                  <StatusBadge
                    status={booking.status}
                    startDate={booking.checkIn}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-primary-900 border border-primary-800 rounded-sm p-6">
        <h3 className="font-semibold text-lg text-accent-400 mb-3">
          Quick links
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/cabins"
            className="bg-accent-500 text-primary-800 px-5 py-3 font-semibold rounded-sm hover:bg-accent-600 transition-colors text-sm"
          >
            Book a room
          </Link>
          <Link
            href="/account/reservations"
            className="border border-primary-600 text-primary-200 px-5 py-3 font-semibold rounded-sm hover:bg-primary-800 transition-colors text-sm"
          >
            My reservations
          </Link>
          <Link
            href="/account/profile"
            className="border border-primary-600 text-primary-200 px-5 py-3 font-semibold rounded-sm hover:bg-primary-800 transition-colors text-sm"
          >
            Edit profile
          </Link>
        </div>
      </div>
    </div>
  );
}
