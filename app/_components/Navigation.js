"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

function getInitials(name) {
  return name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?";
}

export default function Navigation() {
  const { data: session } = useSession();

  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 items-center">
        <li>
          <Link
            href="/cabins"
            className="hover:text-accent-400 transition-colors"
          >
            Rooms
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="hover:text-accent-400 transition-colors"
          >
            About
          </Link>
        </li>
        {session?.user ? (
          <li>
            <Link
              href="/account"
              className="hover:text-accent-400 transition-colors flex items-center gap-3"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-500 text-primary-800 text-sm font-bold">
                {getInitials(session.user.fullName)}
              </span>
              <span>My Bookings</span>
            </Link>
          </li>
        ) : (
          <li>
            <Link
              href="/login"
              className="hover:text-accent-400 transition-colors"
            >
              Sign in
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
