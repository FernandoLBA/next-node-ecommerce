import { Metadata } from "next";
import { getLocale } from "next-intl/server";

import { getMyCart } from "@/lib/actions/cart.actions";
import englishMessages from "@/messages/en.json";
import spanishMessages from "@/messages/es.json";
import { Cart } from "@/types";
import CartTable from "./cart-table";

const locales: Record<string, typeof englishMessages> = {
  en: englishMessages,
  es: spanishMessages,
};

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale();
  const translate = locales[locale];

  return {
    title: translate.CartPage.title,
  };
};

const CartPage = async () => {
  const cart = await getMyCart();

  return (
    <>
      <CartTable cart={cart as Cart} />
    </>
  );
};

export default CartPage;
