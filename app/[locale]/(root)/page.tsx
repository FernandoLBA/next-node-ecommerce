import { getTranslations } from "next-intl/server";

import ProductsList from "@/components/shared/products/products-list";
import { getLatestProducts } from "@/lib/actions/product.actions";
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";
import { Product } from "@/types";

export default async function HomePage() {
  const t = await getTranslations("HomePage");
  const latestProducts = await getLatestProducts();

  return (
    <>
      <ProductsList
        data={latestProducts as Product[]}
        title={t("title")}
        limit={LATEST_PRODUCTS_LIMIT}
      />
    </>
  );
}
