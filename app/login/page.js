"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function getHotelId() {
    const match = document.cookie.match(/(?:^|;\s*)hotel_id=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setPending(true);
    setError("");
    const formData = new FormData(e.target);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      hotelId: getHotelId(),
      redirect: false,
    });
    setPending(false);
    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/account");
      router.refresh();
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-3xl font-semibold text-accent-400 mb-8">Sign in</h1>
      {error && (
        <p className="text-red-500 bg-red-100 px-4 py-3 rounded-sm mb-4">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          disabled={pending}
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full rounded-sm disabled:cursor-not-allowed disabled:opacity-50"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          disabled={pending}
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full rounded-sm disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          disabled={pending}
          className="bg-accent-500 px-8 py-4 text-primary-800 text-lg font-semibold hover:bg-accent-600 transition-all rounded-sm disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {pending && <span className="spinner-mini"></span>}
          Sign in
        </button>
      </form>
      <p className="mt-6 text-primary-200">
        No account?{" "}
        <Link href="/register" className="text-accent-400 underline">
          Register here
        </Link>
      </p>
    </div>
  );
}
