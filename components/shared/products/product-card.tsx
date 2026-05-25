import Link from "next/link";

import AppImage from "@/components/ui/app-image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/types";
import ProductPrice from "./product-price";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="w-full max-w-sm p-0">
      <CardHeader className="p-0 gap-0 items-center">
        <Link href={`/products/${product.slug}`}>
          <AppImage
            containerClassName="p-0 gap-0"
            className="m-0 p-0"
            src={product.images[0]}
            alt={product.name}
            height={300}
            width={300}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-4">
        <div className="text-xs">{product.brand}</div>
        <Link href={`/products/${product.slug}`}>
          <CardTitle>{product.name}</CardTitle>
        </Link>

        <div className="flex-between gap-4">
          <p>{product.rating} Stars</p>
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <p className="text-destructive">Out of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
