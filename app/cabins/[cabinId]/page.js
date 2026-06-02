import Link from "next/link";
import Cabin from "@/app/_components/Cabin";
import Reservation from "@/app/_components/Reservation";
import ReviewList from "@/app/_components/ReviewList";
import ReviewForm from "@/app/_components/ReviewForm";
import Spinner from "@/app/_components/Spinner";
import { getCabin, getCabins, getReviews } from "@/app/_lib/data-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { headers } from "next/headers";

import { Suspense } from "react";
import { StarIcon } from "@heroicons/react/24/solid";

export async function generateMetadata({ params }) {
  const { name } = await getCabin(params.cabinId);
  return { title: `Room ${name}` };
}

export async function generateStaticParams() {
  try {
    const { items } = await getCabins();
    return items.map((cabin) => ({ cabinId: String(cabin.id) }));
  } catch {
    return [];
  }
}

export default async function Page({ params }) {
  const [cabin, { reviews, stats }, session] = await Promise.all([
    getCabin(params.cabinId),
    getReviews(params.cabinId),
    getServerSession(authOptions),
  ]);

  const h = headers();
  const hotelId = h.get("x-hotel-id");

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Link
        href="/cabins"
        className="inline-block mb-6 text-accent-500 hover:text-accent-400 transition-colors"
      >
        &larr; Back to all rooms
      </Link>

      <Cabin cabin={cabin} />

      {stats.count > 0 && (
        <div className="flex items-center gap-4 mb-12 bg-primary-900/30 p-6 rounded-lg border border-primary-800">
          <div className="flex items-center gap-1">
            <StarIcon className="h-8 w-8 text-accent-500" />
            <span className="text-3xl font-bold text-accent-100">{stats.average.toFixed(1)}</span>
          </div>
          <div className="h-8 w-px bg-primary-800"></div>
          <p className="text-lg text-primary-300">
            Based on <span className="font-semibold text-accent-100">{stats.count}</span> guest reviews
          </p>
        </div>
      )}

      <div className="mb-24">
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve {cabin.name} today. Pay on arrival.
        </h2>

        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 mb-24">
        <div>
          <h3 className="text-3xl font-semibold mb-8 text-accent-400">Guest Reviews</h3>
          <Suspense fallback={<Spinner />}>
            <ReviewList reviews={reviews} />
          </Suspense>
        </div>

        <div>
          {session ? (
            <ReviewForm 
              roomId={params.cabinId} 
              hotelId={hotelId} 
              accessToken={session.accessToken} 
            />
          ) : (
            <div className="bg-primary-900 p-8 border border-primary-800 rounded-lg text-center">
              <p className="text-primary-300 mb-4">Want to leave a review?</p>
              <Link 
                href="/login" 
                className="inline-block bg-accent-500 px-6 py-2 text-primary-950 font-semibold rounded hover:bg-accent-600 transition-colors"
              >
                Login to share your experience
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
