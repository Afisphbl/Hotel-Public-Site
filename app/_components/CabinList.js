import CabinCard from "@/app/_components/CabinCard";
import Pagination from "@/app/_components/Pagination";
import SortBy from "@/app/_components/SortBy";
import { getCabins } from "../_lib/data-service";

async function CabinList({ filter, sortBy, sortOrder, page }) {
  const { items: cabins, totalPages } = await getCabins({
    filter,
    sortBy,
    sortOrder,
    page,
  });

  if (!cabins.length) return null;

  return (
    <div>
      <div className="flex justify-end mb-6">
        <SortBy />
      </div>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
        {cabins.map((cabin) => (
          <CabinCard cabin={cabin} key={cabin.id} />
        ))}
      </div>
      <Pagination totalPages={totalPages} />
    </div>
  );
}

export default CabinList;
