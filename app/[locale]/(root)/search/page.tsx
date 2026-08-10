import Pagination from "@/components/shared/pagination";
import ProductCard from "@/components/shared/products/product-card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import {
  getAllCategories,
  getAllProducts,
} from "@/lib/actions/product.actions";
import { appRoutes, priceRanges, ratingRanges } from "@/lib/constants";
import { convertSearchParamsToSearchUrl } from "@/lib/utils";
import { Product } from "@/types";
import { X } from "lucide-react";

type SearchPageProps = {
  searchParams: Promise<{
    query?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
};

const SearchPage = async (props: SearchPageProps) => {
  const {
    query = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
  } = await props.searchParams;
  const categories = await getAllCategories();
  const products = await getAllProducts({
    query,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  });

  //* construct filter url
  const getFilterUrl = ({
    c, //? category
    s, //? sort
    p, //? price
    r, //? rating
    pg, //? page
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { query, category, price, sort, rating, page };

    if (c) params.category = c;
    if (s) params.sort = s;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;

    return convertSearchParamsToSearchUrl(params);
  };

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links pb-6">
        <div className="text-xl mb-2">Department</div>

        <div>
          <ul className="space-y-1 ml-2">
            {[{ category: "all", _count: "" }, ...categories].map((c) => (
              <li key={c.category}>
                <Link
                  className={`${c.category !== category ? "hover:underline" : "font-bold text-accent-foreground cursor-default!"} capitalize`}
                  href={getFilterUrl({ c: c.category })}
                >
                  {c.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-xl my-4">Price</div>

        <div>
          <ul className="space-y-1 ml-2">
            {priceRanges.map((p) => (
              <li key={p.name}>
                <Link
                  className={`${p.value !== price ? "hover:underline" : "font-bold text-accent-foreground cursor-default!"}`}
                  href={getFilterUrl({ p: p.value })}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-xl my-4">Rating</div>

        <div>
          <ul className="space-y-1 ml-2">
            {ratingRanges.map((r) => (
              <li key={r}>
                <Link
                  className={`${r !== rating ? "hover:underline" : "font-bold text-accent-foreground cursor-default!"}`}
                  href={getFilterUrl({ r })}
                >
                  {`${r === "all" ? "All" : r + " stars & up"}`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="md:col-span-4 space-y-4">
        <div className="flex-start flex-col md:flex-row">
          <div className="flex items-center">
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
          </div>
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

        <div className="grid grid-cols-2 gap-2 md:gap-4 md:grid-cols-3">
          {products.data.length === 0 && <div>No products found</div>}

          {products.data.map((product) => (
            <ProductCard key={product.id} product={product as Product} />
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
