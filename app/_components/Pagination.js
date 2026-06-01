"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

function Pagination({ totalPages }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = Number(searchParams.get("page")) || 1;

  function goTo(page) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-12 text-primary-200">
      <button
        disabled={currentPage <= 1}
        onClick={() => goTo(currentPage - 1)}
        className="px-4 py-2 bg-primary-800 border border-primary-700 rounded-sm text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-700 transition-all"
      >
        &larr; Previous
      </button>

      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>

      <button
        disabled={currentPage >= totalPages}
        onClick={() => goTo(currentPage + 1)}
        className="px-4 py-2 bg-primary-800 border border-primary-700 rounded-sm text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-700 transition-all"
      >
        Next &rarr;
      </button>
    </div>
  );
}

export default Pagination;
