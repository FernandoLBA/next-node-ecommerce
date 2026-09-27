import ProductForm from "@/components/admin/product-form";
import { getAllCategories } from "@/lib/actions/category.actions";
import { getProductById } from "@/lib/actions/product.actions";
import { Product } from "@/types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("AdminPages.products");

  return { title: t("updateTitle") };
};

const AdminProductUpdatePage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await props.params;
  const t = await getTranslations("AdminPages.products");
  const product = await getProductById(id);

  if (!product) throw new Error("Product not found.");

  const { data: categories } = await getAllCategories({
    query: "",
    page: 1,
    limit: 1000,
  });

  return (
    <div className="space-y-8 mx-auto">
      <h1 className="h2-bold">{t("updateTitle")}</h1>

      <ProductForm
        type="Update"
        productId={product.id}
        product={product as Product}
        categories={categories}
      />
    </div>
  );
};

export default AdminProductUpdatePage;
