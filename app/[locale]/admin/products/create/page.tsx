import { Metadata } from "next";
import { getLocale } from "next-intl/server";

import ProductForm from "@/components/admin/product-form";
import { getLanguage } from "@/lib/utils";
import { Locale, Product } from "@/types";

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale();
  const { currentLanguage } = getLanguage(locale as Locale);

  return { title: currentLanguage.AdminPages.products.createProductForm.title };
};

const CreateProductPage = async () => {
  const locale = await getLocale();
  const { currentLanguage } = getLanguage(locale as Locale);

  return (
    <>
      <h1 className="h2-bold">
        {currentLanguage.AdminPages.products.createProductForm.title}
      </h1>

      <div className="my-8">
        <ProductForm type="Create" productId="1" product={{} as Product} />
      </div>
    </>
  );
};

export default CreateProductPage;
