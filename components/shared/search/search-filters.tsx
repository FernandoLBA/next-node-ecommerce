import { Link } from "@/i18n/routing";
import { getAllCategories } from "@/lib/actions/product.actions";
import { priceRanges, RATING_RANGES } from "@/lib/constants";
import { cn, getFilterUrl } from "@/lib/utils";
import { FilterSearchParams } from "@/types";

type SearchFiltersProps = {
  size?: "xl" | "md";
} & FilterSearchParams;

const SearchFilters = async ({ searchParams, size }: SearchFiltersProps) => {
  const categories = await getAllCategories();
  const selectedClasses = "font-bold text-accent-foreground cursor-default!";
  const hoverClasses = "hover:underline";
  const titleClasses = `text-${size} font-bold`;

  return (
    <div className="filter-links pb-6">
      <div className={cn("", titleClasses)}>Department</div>

      <div>
        <ul className="space-y-1 ml-2">
          {[{ category: "all", _count: "" }, ...categories].map((c) => (
            <li key={c.category}>
              <Link
                className={`${c.category !== searchParams.category ? hoverClasses : selectedClasses} capitalize`}
                href={getFilterUrl({ ...searchParams, c: c.category })}
              >
                {c.category}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className={cn(`mt-8`, titleClasses)}>Price</div>

      <div>
        <ul className="space-y-1 ml-2">
          {priceRanges.map((p) => (
            <li key={p.name}>
              <Link
                className={`${p.value !== searchParams.price ? hoverClasses : selectedClasses}`}
                href={getFilterUrl({ ...searchParams, p: p.value })}
              >
                {p.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className={cn("mt-8", titleClasses)}>Rating</div>

      <div>
        <ul className="space-y-1 ml-2">
          {RATING_RANGES.map((r) => (
            <li key={r}>
              <Link
                className={`${r !== searchParams.rating ? hoverClasses : selectedClasses}`}
                href={getFilterUrl({ ...searchParams, r })}
              >
                {`${r === "all" ? "All" : r + " stars & up"}`}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchFilters;
