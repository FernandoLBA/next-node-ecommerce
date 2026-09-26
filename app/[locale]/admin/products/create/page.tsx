import { Metadata } from "next";
import { getLocale } from "next-intl/server";

import { getAllCategories } from "@/lib/actions/category.actions";
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
  const { data: categories } = await getAllCategories({
    query: "",
    page: 1,
    limit: 1000,
  });

  return (
    <>
      <h1 className="h2-bold">
        {currentLanguage.AdminPages.products.createProductForm.title}
      </h1>

      <div className="my-8">
        <ProductForm
          type="Create"
          productId="1"
          product={{} as Product}
          categories={categories}
        />
      </div>
    </>
  );
};

export default CreateProductPage;
