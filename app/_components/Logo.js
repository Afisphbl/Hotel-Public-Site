import Image from "next/image";
import Link from "next/link";
import { getHotelFromHeaders } from "@/app/_lib/hotel-context";
import logo from "@/public/logo.png";

function Logo() {
  const hotel = getHotelFromHeaders();
  const name = hotel?.name || "LuxeHotel";

  return (
    <Link href="/" className="flex items-center gap-4 z-10">
      <Image
        src={logo}
        height="60"
        quality={100}
        width="60"
        alt={name}
      />
      <span className="text-xl font-semibold text-primary-100">
        {name}
      </span>
    </Link>
  );
}

export default Logo;
