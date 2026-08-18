import { getTranslations } from "next-intl/server";

import IconBoxes from "@/components/icon-boxes";
import ProductCarousel from "@/components/shared/products/product-carousel";
import ProductsList from "@/components/shared/products/products-list";
import TopCategories from "@/components/top-categories";
import ViewAllProductsButton from "@/components/view-all-products-button";
import {
  getFeaturedProducts,
  getLatestProducts,
} from "@/lib/actions/product.actions";
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";
import { Product } from "@/types";

export default async function HomePage() {
  const t = await getTranslations("HomePage");
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts as Product[]} />
      )}

      <ProductsList
        data={latestProducts as Product[]}
        title={t("title")}
        limit={LATEST_PRODUCTS_LIMIT}
      />

      {latestProducts.length > 0 && <ViewAllProductsButton />}

      <TopCategories />

      {/* // * Temporal promotions, for now I don't need it */}
      {/* <DealCountdown /> */}

      <IconBoxes />
    </>
  );
}
