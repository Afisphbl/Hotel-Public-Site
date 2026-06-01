import CabinCard from "@/app/_components/CabinCard";
import Pagination from "@/app/_components/Pagination";
import { getCabins } from "../_lib/data-service";

async function CabinList({ filter, sortBy, sortOrder, page, roomType }) {
  const { items: cabins, totalPages } = await getCabins({
    filter,
    sortBy,
    sortOrder,
    page,
    roomType,
  });

  if (!cabins.length) return null;

  return (
    <div>
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
