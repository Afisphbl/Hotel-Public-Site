"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BACKEND_URL } from "@/app/_lib/data-service-shared";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("processing");
  const [error, setError] = useState("");

  useEffect(() => {
    const tx_ref = searchParams.get("tx_ref");
    const chapaStatus = searchParams.get("status");

    if (chapaStatus === "success" || tx_ref) {
      setStatus("success");
    } else if (chapaStatus === "failed" || chapaStatus === "cancelled") {
      setStatus("failed");
      setError("Payment was not completed. Please try again.");
    } else {
      setStatus("pending");
    }
  }, [searchParams]);

  if (status === "processing") {
    return (
      <div className="text-center space-y-6 mt-4">
        <div className="animate-spin h-10 w-10 border-4 border-accent-500 border-t-transparent rounded-full mx-auto" />
        <p className="text-xl text-primary-300">Verifying your payment...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="text-center space-y-6 mt-4">
        <div className="text-6xl">❌</div>
        <h1 className="text-3xl font-semibold text-red-400">
          Payment {status === "failed" ? "Failed" : "Cancelled"}
        </h1>
        <p className="text-primary-300 text-lg">{error}</p>
        <Link
          href="/cabins"
          className="inline-block bg-accent-500 px-8 py-3 text-primary-950 font-semibold rounded-lg hover:bg-accent-600 transition-colors"
        >
          Browse rooms again
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6 mt-4">
      <div className="text-6xl">✓</div>
      <h1 className="text-3xl font-semibold text-accent-400">
        Payment successful!
      </h1>
      <p className="text-primary-300 text-lg">
        Thank you for your reservation. Your booking has been confirmed.
      </p>
      <Link
        href="/account/reservations"
        className="inline-block bg-accent-500 px-8 py-3 text-primary-950 font-semibold rounded-lg hover:bg-accent-600 transition-colors"
      >
        View my reservations &rarr;
      </Link>
    </div>
  );
}
