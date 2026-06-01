import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import bg from "@/public/bg.png";

export default function Page() {
  const h = headers();
  const homePageImage = h.get("x-hotel-homepage-image");

  return (
    <main className="mt-24">
      {homePageImage ? (
        <img
          src={homePageImage}
          className="object-cover object-top absolute inset-0 w-full h-full"
          alt="Luxurious hotel"
        />
      ) : (
        <Image
          src={bg}
          fill
          placeholder="blur"
          quality={80}
          className="object-cover object-top"
          alt="Luxurious hotel"
        />
      )}

      <div className="relative z-10 text-center">
        <h1 className="text-8xl text-primary-50 mb-10 tracking-tight font-normal">
          Welcome to paradise.
        </h1>
        <Link
          href="/cabins"
          className="bg-accent-500 px-8 py-6 text-primary-800 text-lg font-semibold hover:bg-accent-600 transition-all"
        >
          Explore luxury rooms
        </Link>
      </div>
    </main>
  );
}
