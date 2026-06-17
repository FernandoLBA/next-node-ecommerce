import { Metadata } from "next";

import { auth } from "@/auth";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { redirect } from "@/i18n/routing";
import { getUserById } from "@/lib/actions/user.actions";
import { appRoutes } from "@/lib/constants";
import PaymentMethodForm from "./payment-method-form";

export const metadata: Metadata = {
  title: "Select Payment Method",
};

const PaymentMethodPage = async (props: {
  params: Promise<{ locale: string }>;
}) => {
  const session = await auth();
  const { locale } = await props.params;

  const userId = session?.user.id;

  if (!userId) redirect({ href: appRoutes.SIGN_IN, locale });

  const user = await getUserById(userId!);

  return (
    <>
      <CheckoutSteps current={2} />
      <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
    </>
  );
};

export default PaymentMethodPage;
