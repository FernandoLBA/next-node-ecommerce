import { notFound } from "next/navigation";

import { auth } from "@/auth";
import AddToCart from "@/components/shared/products/add-to-cart";
import ProductImages from "@/components/shared/products/product-images";
import ProductPrice from "@/components/shared/products/product-price";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getProductBySlug } from "@/lib/actions/product.actions";
import ReviewList from "./review-list";

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const session = await auth();
  const userId = session?.user.id;
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) return notFound();

  const cart = (await getMyCart()) || undefined;

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* //* images column */}
          <div className="col-span-2">
            {product.images.length >= 1 && (
              <ProductImages images={product.images} />
            )}
          </div>

          {/* //* details column */}
          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-6">
              <p>
                {product.brand} {product.category}
              </p>
              <h1 className="h3-bold">{product.name}</h1>
              <p>
                {product.rating as string} of {product.numReviews} Reviews
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <ProductPrice
                  value={Number(product.price)}
                  className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
                />
              </div>
            </div>

            <div className="mt-10">
              <p className="font-semibold">Description</p>
              <p>{product.description}</p>
            </div>
          </div>

          {/* //* Action column */}
          <div>
            <Card>
              <CardContent>
                <div className="mb-2 flex-between">
                  <div>Price</div>
                  <div>
                    <ProductPrice value={Number(product.price)} />
                  </div>
                </div>

                <div className="mb-2 flex-between">
                  <div>Status</div>
                  {product.stock > 0 ? (
                    <Badge variant="outline">In stock</Badge>
                  ) : (
                    <Badge variant="destructive">Out of stock</Badge>
                  )}
                </div>

                {product.stock > 0 && (
                  <div className="flex-center">
                    <AddToCart
                      cart={cart}
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price as string,
                        qty: 1,
                        image: product.images![0],
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="h2-bold">Customer Reviews</h2>
        <ReviewList
          userId={userId || ""}
          productId={product.id || ""}
          productSlug={product.slug || ""}
        />
      </section>
    </>
  );
};

export default ProductDetailsPage;
