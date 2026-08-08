import { Metadata } from "next";

import ProductForm from "@/components/admin/product-form";
import { getProductById } from "@/lib/actions/product.actions";
import { Product } from "@/types";

export const metadata: Metadata = {
  title: "Update Product",
};

const AdminProductUpdatePage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await props.params;
  const product = await getProductById(id);

  if (!product) throw new Error("Product not found.");

  return (
    <div className="space-y-8 mx-auto">
      <h1 className="h2-bold">Update Product</h1>

      <ProductForm
        type="Update"
        productId={product.id}
        product={product as Product}
      />
    </div>
  );
};

export default AdminProductUpdatePage;
