import ProductsList from "@/components/shared/products/products-list";
import { getLatestProducts } from "@/lib/actions/product.actions";
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";
import { Product } from "@/types";

export default async function HomePage() {
  const latestProducts = await getLatestProducts();

  return (
    <>
      <ProductsList
        data={latestProducts as Product[]}
        title="Newest Arrivals"
        limit={LATEST_PRODUCTS_LIMIT}
      />
    </>
  );
}
