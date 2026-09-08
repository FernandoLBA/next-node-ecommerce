import { getAllCategories } from "@/lib/actions/product.actions";
import { priceRanges, RATING_RANGES } from "@/lib/constants";
import { cn, getFilterUrl } from "@/lib/utils";
import { FilterSearchParams } from "@/types";
import { AppLink } from "../app-link/app-link";

type SearchFiltersProps = {
  size?: "xl" | "md";
} & FilterSearchParams;

const SearchFilters = async ({ searchParams, size }: SearchFiltersProps) => {
  const categories = await getAllCategories();
  const titleClasses = `text-${size} font-bold`;

  return (
    <div className="filter-links pb-6">
      <div className={cn("mb-2", titleClasses)}>Department</div>

      <div>
        <ul className="space-y-1 ml-2">
          {[{ category: "all", _count: "" }, ...categories].map((c) => (
            <li key={c.category}>
              <AppLink
                href={getFilterUrl({ ...searchParams, c: c.category })}
                isSelected={c.category === searchParams.category}
              >
                {c.category}
              </AppLink>
            </li>
          ))}
        </ul>
      </div>

      <div className={cn(`mt-8 mb-2`, titleClasses)}>Price</div>

      <div>
        <ul className="space-y-1 ml-2">
          {priceRanges.map((p) => (
            <li key={p.name}>
              <AppLink
                href={getFilterUrl({ ...searchParams, p: p.value })}
                isSelected={p.value === searchParams.price}
              >
                {p.name}
              </AppLink>
            </li>
          ))}
        </ul>
      </div>

      <div className={cn("mt-8 mb-2", titleClasses)}>Rating</div>

      <div>
        <ul className="space-y-1 ml-2">
          {RATING_RANGES.map((r) => (
            <li key={r}>
              <AppLink
                href={getFilterUrl({ ...searchParams, r })}
                isSelected={r === searchParams.rating}
              >
                {`${r === "all" ? "All" : r + " stars & up"}`}
              </AppLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchFilters;
