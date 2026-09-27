import { getTranslations } from "next-intl/server";

import { getAllCategories } from "@/lib/actions/product.actions";
import { priceRanges, RATING_RANGES } from "@/lib/constants";
import { cn, getFilterUrl } from "@/lib/utils";
import { FilterSearchParams } from "@/types";
import { AppLink } from "../app-link/app-link";

type SearchFiltersProps = {
  size?: "xl" | "md";
} & FilterSearchParams;

const SearchFilters = async ({ searchParams, size }: SearchFiltersProps) => {
  const t = await getTranslations("SearchPage");
  const categories = await getAllCategories();
  const titleClasses = `text-${size} font-bold`;

  return (
    <div className="filter-links pb-6">
      <div className={cn("mb-2", titleClasses)}>{t("department")}</div>

      <div>
        <ul className="space-y-1 ml-2">
          {[{ id: "all", name: "all" }, ...categories].map((c) => (
            <li key={c.id}>
              <AppLink
                href={getFilterUrl({ ...searchParams, c: c.name })}
                className={`${c.name === searchParams.category && "nav-link-selected"}`}
              >
                {c.id === "all" ? t("all") : c.name}
              </AppLink>
            </li>
          ))}
        </ul>
      </div>

      <div className={cn(`mt-8 mb-2`, titleClasses)}>{t("price")}</div>

      <div>
        <ul className="space-y-1 ml-2">
          {priceRanges.map((p) => (
            <li key={p.name}>
              <AppLink
                href={getFilterUrl({ ...searchParams, p: p.value })}
                className={`${p.value === searchParams.price && "nav-link-selected"}`}
              >
                {p.value === "all" ? t("all") : p.name}
              </AppLink>
            </li>
          ))}
        </ul>
      </div>

      <div className={cn("mt-8 mb-2", titleClasses)}>{t("rating")}</div>

      <div>
        <ul className="space-y-1 ml-2">
          {RATING_RANGES.map((r) => (
            <li key={r}>
              <AppLink
                href={getFilterUrl({ ...searchParams, r })}
                className={`${r === searchParams.rating && "nav-link-selected"}`}
              >
                {r === "all" ? t("all") : t("starsAndUp", { count: Number(r) })}
              </AppLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchFilters;
