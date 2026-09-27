import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { auth } from "@/auth";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { redirect } from "@/i18n/routing";
import { getUserById } from "@/lib/actions/user.actions";
import { appRoutes } from "@/lib/constants";
import PaymentMethodForm from "./payment-method-form";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("PaymentMethod");

  return { title: t("metaTitle") };
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
