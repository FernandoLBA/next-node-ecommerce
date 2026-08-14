"use client";

import { Minus, Plus } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import LoaderIcon from "@/components/ui/loader-icon";
import { useRouter } from "@/i18n/routing";
import { addItemToCart, removeItemFromcart } from "@/lib/actions/cart.actions";
import { appRoutes } from "@/lib/constants";
import { Cart, CartItem } from "@/types";

function AddToCart({ item, cart }: { item: CartItem; cart?: Cart }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  /**
   * Add items to cart
   */
  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message, {
        description: `${item.name} added to cart`,

        action: (
          <Button variant="outline" onClick={() => router.push(appRoutes.CART)}>
            Go To Cart
          </Button>
        ),
      });
    });
  };

  /**
   * Remove items from cart
   */
  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const { success, message } = await removeItemFromcart(item.productId);

      if (!success) {
        toast.error(message);
        return;
      }

      toast.success(message, {
        description: `${item.name} removed from cart`,
        action:
          cart && cart.items.length >= 1 ? (
            <Button
              variant="outline"
              onClick={() => router.push(appRoutes.CART)}
            >
              Go To Cart
            </Button>
          ) : null,
      });

      return;
    });
  };

  //? Check if the item already exists in the cart
  const existItem =
    cart && cart.items.find((product) => product.productId === item.productId);

  return existItem ? (
    <div className="bg-accent rounded-full w-full flex-between">
      <Button type="button" disabled={isPending} onClick={handleRemoveFromCart}>
        {isPending ? <LoaderIcon /> : <Minus className="w-4 h-4" />}
      </Button>

      <span>{existItem.qty}</span>

      <Button type="button" disabled={isPending} onClick={handleAddToCart}>
        {isPending ? <LoaderIcon /> : <Plus className="w-4 h-4" />}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full"
      disabled={isPending}
      type="button"
      onClick={handleAddToCart}
    >
      {isPending ? (
        <>
          <LoaderIcon /> Adding to Cart
        </>
      ) : (
        <>
          <Plus /> Add to Cart
        </>
      )}
    </Button>
  );
}

export default AddToCart;
