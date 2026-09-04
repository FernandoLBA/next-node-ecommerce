import { Filter, X } from "lucide-react";

import Pagination from "@/components/shared/pagination";
import ProductCard from "@/components/shared/products/product-card";
import SearchFilters from "@/components/shared/search/search-filters";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "@/i18n/routing";
import { getAllProducts } from "@/lib/actions/product.actions";
import {
  appRoutes,
  SORTING_ORDERS_VALUES,
  sortingOrders,
} from "@/lib/constants";
import { getFilterUrl } from "@/lib/utils";
import { AsyncFilterSearchParams, Product } from "@/types";

export async function generateMetadata(props: {
  searchParams: Promise<{
    query: string;
    category: string;
    price: string;
    rating: string;
  }>;
}) {
  const {
    query = "all",
    category = "all",
    price = "all",
    rating = "all",
  } = await props.searchParams;
  const isQuerySet = query && query !== "all" && query.trim() !== "";
  const isCategorySet =
    category && category !== "all" && category.trim() !== "";
  const isPriceSet = price && price !== "all" && price.trim() !== "";
  const isRatingSet = rating && rating !== "all" && rating.trim() !== "";

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `Search ${isQuerySet ? query : ""} 
      ${isCategorySet ? `: Category ${category}` : ""}
      ${isPriceSet ? `: Price ${price}` : ""}
      ${isRatingSet ? `: Rating ${rating}` : ""}
      `,
    };
  } else {
    return { title: "Search products" };
  }
}

const SearchPage = async (props: AsyncFilterSearchParams) => {
  const {
    query = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
  } = await props.searchParams;
  const params = { query, category, price, rating, sort, page };
  const products = await getAllProducts({
    query,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  });

  return (
    <div className="grid md:grid-cols-5 gap-2 md:gap-5">
      <div className="hidden md:block">
        <SearchFilters searchParams={params} size="md" />
      </div>

      <div className="md:col-span-4">
        <div className="flex-between flex-col gap-4 mb-4 md:flex-row">
          {/* FILTERS APPLIED */}
          <div className="flex items-center w-full">
            {query !== "all" && query !== "" && (
              <span>
                <b>Query: </b>
                {query}
              </span>
            )}
            {category !== "all" && category !== "" && (
              <span className={`${query !== "all" && "mx-2"}`}>
                <b>Category: </b> {category}
              </span>
            )}
            {price !== "all" && price !== "" && (
              <span className={`${price !== "all" && "mx-2"}`}>
                <b>Price: </b> {price}
              </span>
            )}
            {rating !== "all" && rating !== "" && (
              <span className={`${rating !== "all" && "mx-2"}`}>
                <b>Rating: </b> {rating}
                {`${rating === "1" ? " star & up" : " stars & up"}`}
              </span>
            )}
            &nbsp;
            {(query !== "all" && query !== "") ||
            (category !== "all" && category !== "") ||
            price !== "all" ||
            rating !== "all" ? (
              <Button variant="link">
                <Link href={appRoutes.SEARCH}>
                  <X />
                </Link>
              </Button>
            ) : null}
          </div>

          {/* FILTERS SND SORTING SECTION */}
          <div className="flex-end w-full md:w-fit gap-2">
            {/* FILTERS BUTTON */}
            <div className="block md:hidden">
              <Sheet>
                <SheetTrigger>
                  <Filter />
                </SheetTrigger>

                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Please select your options for filtering
                    </SheetDescription>
                  </SheetHeader>

                  <div className="ml-6">
                    <SearchFilters searchParams={params} />
                  </div>

                  <SheetFooter>
                    <SheetClose render={<Button>Close</Button>} />
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>

            {/* SORT */}
            <div className="flex items-center w-full md:max-w-28">
              <Select items={sortingOrders}>
                <SelectTrigger className="w-full self-end">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>

                <SelectContent className="w-fit">
                  <SelectGroup>
                    {SORTING_ORDERS_VALUES.map((s) => (
                      <SelectItem key={s} value={s}>
                        <Link
                          href={getFilterUrl({ ...params, s })}
                          className="capitalize"
                        >
                          {s}
                        </Link>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 md:gap-4 md:grid-cols-3">
          {products.data.length === 0 && <div>No products found</div>}

          {products.data.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.totalPages > 1 && (
          <Pagination page={page} totalPages={products.totalPages} />
        )}
      </div>
    </div>
  );
};

export default SearchPage;
