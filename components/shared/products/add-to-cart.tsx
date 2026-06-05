"use client";

import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import LoaderIcon from "@/components/ui/loader-icon";
import { addItemToCart, removeItemFromcart } from "@/lib/actions/cart.actions";
import { getCssVariableValue } from "@/lib/utils";
import { Cart, CartItem } from "@/types";

function AddToCart({ item, cart }: { item: CartItem; cart?: Cart }) {
  const primaryForegroundColor = getCssVariableValue("--primary-foreground");

  const router = useRouter();
  const [isAdding, startAdding] = useTransition();
  const [isRemoving, startRemoving] = useTransition();

  const handleAddToCart = async () => {
    startAdding(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message, {
        description: `${item.name} added to cart`,
        action: (
          <div className="w-full flex justify-end">
            <Button onClick={() => router.push("/cart")}>Go To Cart</Button>
          </div>
        ),
      });
    });
  };

  const handleRemoveFromCart = async () => {
    startRemoving(async () => {
      const { success, message } = await removeItemFromcart(item.productId);

      if (!success) {
        toast.error(message);
        return;
      }

      toast.success(message, {
        description: `${item.name} removed from cart`,
      });

      return;
    });
  };

  //* Check if the item already exists in the cart
  const existItem =
    cart && cart.items.find((product) => product.productId === item.productId);

  return existItem ? (
    <div className="bg-accent rounded-full w-full flex-between">
      <Button
        className="bg-white!"
        type="button"
        disabled={isAdding || isRemoving}
        variant="outline"
        onClick={handleRemoveFromCart}
      >
        {isRemoving ? <LoaderIcon /> : <Minus className="w-4 h-4" />}
      </Button>

      <span>{existItem.qty}</span>

      <Button
        className="bg-white!"
        type="button"
        disabled={isAdding || isRemoving}
        variant="outline"
        onClick={handleAddToCart}
      >
        {isAdding ? <LoaderIcon /> : <Plus className="w-4 h-4" />}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full"
      disabled={isAdding || isRemoving}
      type="button"
      onClick={handleAddToCart}
    >
      {isAdding ? (
        <>
          <LoaderIcon loaderColor={primaryForegroundColor} /> Adding to
          Cart
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
