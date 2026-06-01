"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const sortOptions = [
  { value: "floor-asc", label: "Floor \u2191" },
  { value: "floor-desc", label: "Floor \u2193" },
  { value: "price-asc", label: "Price \u2191" },
  { value: "price-desc", label: "Price \u2193" },
  { value: "capacity-asc", label: "Capacity \u2191" },
  { value: "capacity-desc", label: "Capacity \u2193" },
  { value: "roomNumber-asc", label: "Room \u2191" },
  { value: "roomNumber-desc", label: "Room \u2193" },
];

function SortBy() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentSortBy = searchParams.get("sortBy") || "floor";
  const currentSortOrder = searchParams.get("sortOrder") || "asc";
  const currentValue = `${currentSortBy}-${currentSortOrder}`;

  function handleChange(e) {
    const [sortBy, sortOrder] = e.target.value.split("-");
    const params = new URLSearchParams(searchParams);
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <select
      value={currentValue}
      onChange={handleChange}
      className="px-4 py-2 bg-primary-800 text-primary-200 border border-primary-700 rounded-sm text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent-500"
    >
      {sortOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export default SortBy;
