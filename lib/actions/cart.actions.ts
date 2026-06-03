"use server";

import { cookies } from "next/headers";

import { auth } from "@/auth";
import db from "@/db/db";
import { CartItem } from "@/types";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { cartItemSchema, insertCartSchema } from "../validators";

//* Calculate cart prices
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0),
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(itemsPrice * 0.15),
    totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  let updatingCart = false;
  try {
    //* Check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) throw new Error("No session cart ID found");

    //* Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    //* Get cart
    const cart = await getMyCart();

    //* Parse and validate item
    const item = cartItemSchema.parse(data);

    //* Find product in database
    const product = await db.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) throw new Error("Product not found");

    //* If cart does not exist, create a new cart, otherwise update the existing cart
    if (!cart) {
      //* Create a new cart object
      const newCart = insertCartSchema.parse({
        userId,
        items: [item],
        sessionCartId,
        ...calcPrice([item]),
      });

      //* Add to database
      await db.cart.create({ data: newCart });
    } else {
      //* Check if the product is already in the cart
      const existingItemIndex = (cart.items as CartItem[]).findIndex(
        (cartItem) => cartItem.productId === item.productId,
      );

      //* If the product is already in the cart, update the quantity, otherwise add the new item to the cart
      if (existingItemIndex !== -1) {
        //* Check if there is enough stock for the new quantity
        if (
          product.stock <
          (cart.items as CartItem[])[existingItemIndex].qty + item.qty
        ) {
          return {
            success: false,
            message: `Only ${product.stock} items in stock`,
          };
        }

        (cart.items as CartItem[])[existingItemIndex].qty += item.qty;
        updatingCart = true;
      } else {
        cart.items.push(item);
      }

      //* Update the cart in the database
      await db.cart.update({
        where: { id: cart.id },
        data: {
          items: [...cart.items],
          ...calcPrice([...cart.items]),
        },
      });
    }

    //* revalidate product page
    revalidatePath(`/products/${product.slug}`);

    return {
      success: true,
      message: updatingCart ? "Cart updated" : "Item added to cart",
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: await formatError(error),
    };
  }
}

export async function getMyCart() {
  try {
    //* Check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) throw new Error("No session cart ID found");

    //* Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    //* Get user cart from database
    const cart = await db.cart.findFirst({
      where: userId ? { userId } : { sessionCartId },
    });

    if (!cart) return null;

    return convertToPlainObject({
      ...cart,
      items: cart.items as CartItem[],
      itemsPrice: cart.itemsPrice as unknown as string,
      totalPrice: cart.totalPrice as unknown as string,
      shippingPrice: cart.shippingPrice as unknown as string,
      taxPrice: cart.taxPrice as unknown as string,
    });
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return null;
  }
}

export async function removeItemFromcart(productId: string) {
  try {
    //* Check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) throw new Error("No session cart ID found");

    //* Find product in database
    const product = await db.product.findFirst({
      where: { id: productId },
    });

    if (!product) throw new Error("Product not found");

    //* Get cart from database
    const cart = await getMyCart();

    if (!cart) throw new Error("Cart not found");

    //* Get item from cart
    const item = (cart.items as CartItem[]).find(
      (item) => item.productId === productId,
    );

    if (!item) throw new Error("Item not found in cart");

    //* If the item quantity is 1, remove it from the cart, otherwise decrease the quantity by 1
    if (item.qty === 1) {
      cart.items = (cart.items as CartItem[]).filter(
        (item) => item.productId !== productId,
      );
    } else {
      cart.items = (cart.items as CartItem[]).map((item) => {
        if (item.productId === productId) {
          return { ...item, qty: item.qty - 1 };
        }
        return item;
      });
    }

    await db.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items,
        ...calcPrice(cart.items as CartItem[]),
      },
    });

    revalidatePath(`/products/${product.slug}`);

    return {
      success: true,
      message: "Item removed from cart",
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: await formatError(error),
    };
  }
}
