"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { interpretAiSearch } from "../_lib/data-service-shared";

function AiSearch({ hotelId }) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  async function handleAiSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const { filters } = await interpretAiSearch(query, hotelId);
      
      const params = new URLSearchParams(searchParams);
      
      if (filters.minCapacity) params.set("minCapacity", filters.minCapacity);
      if (filters.maxCapacity) params.set("maxCapacity", filters.maxCapacity);
      if (filters.roomTypeId) params.set("roomType", filters.roomTypeId);
      if (filters.startDate) params.set("startDate", filters.startDate);
      if (filters.endDate) params.set("endDate", filters.endDate);
      if (filters.sortBy) params.set("sortBy", filters.sortBy);
      if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
      
      params.set("page", "1");
      
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      setQuery("");
    } catch (err) {
      console.error("AI Search Error:", err);
      setError("Failed to understand your request. Try something like 'room for 4 people'.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mb-8 p-6 bg-primary-900 border border-primary-800 rounded-lg">
      <h3 className="text-xl font-semibold mb-4 text-accent-400 flex items-center gap-2">
        <span>✨</span> Smart Search
      </h3>
      <form onSubmit={handleAiSearch} className="flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g., 'I want a luxury room for 2 guests' or 'Cheap room for next weekend'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-primary-800 text-primary-200 border border-primary-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all placeholder:text-primary-600"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-accent-500 text-primary-900 font-semibold rounded-md hover:bg-accent-600 disabled:bg-primary-700 disabled:text-primary-400 transition-all flex items-center gap-2"
          >
            {isLoading ? "Thinking..." : "Search"}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <p className="text-primary-400 text-xs italic">
          Tip: Our AI understands natural language. Just tell us what you're looking for!
        </p>
      </form>
    </div>
  );
}

export default AiSearch;
