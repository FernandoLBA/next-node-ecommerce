import type { Metadata } from "next";

import { auth } from "@/auth";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { redirect } from "@/i18n/routing";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { appRoutes } from "@/lib/constants";
import type { ShippingAddress } from "@/types";
import ShippingAddressForm from "./shipping-address-form";

export const metadata: Metadata = {
  title: "Shipping Address",
};

const ShippingAddressPage = async (props: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await props.params;
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0)
    redirect({ href: appRoutes.CART, locale });

  const session = await auth();
  if (!session) redirect({ href: appRoutes.SIGN_IN, locale });

  const userId = session?.user.id;
  if (!userId) throw new Error("No user ID");

  const user = await getUserById(userId);
  if (!user) throw new Error("No user found");

  return (
    <>
      <CheckoutSteps current={1} />
      <ShippingAddressForm address={user.address as ShippingAddress} />
    </>
  );
};

export default ShippingAddressPage;
