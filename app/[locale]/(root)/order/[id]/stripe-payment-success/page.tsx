import { AppLinkButton } from "@/components/shared/app-link-button/app-link-button";
import { AppLink } from "@/components/shared/app-link/app-link";
import AppImage from "@/components/ui/app-image";
import { sendPurchaseReceipt } from "@/email";
import { redirect } from "@/i18n/routing";
import { getOrderById } from "@/lib/actions/order.actions";
import { appRoutes } from "@/lib/constants";
import { stripe } from "@/lib/stripe";
import { convertToPlainObject } from "@/lib/utils";
import { PaymentResult, ShippingAddress } from "@/types";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

type SuccessPageProps = {
  params: Promise<{ id: string; locale: string }>;
  searchParams: Promise<{ payment_intent: string }>;
};

const SuccessPage = async (props: SuccessPageProps) => {
  const { id, locale } = await props.params;
  const t = await getTranslations("StripeSuccess");
  const { payment_intent } = await props.searchParams;

  //? Fetch order
  const order = await getOrderById(id);

  if (!order) notFound();

  //? Stripe adds payment_intent to the return url, without it there is nothing to verify
  if (!payment_intent) {
    return redirect({ href: `${appRoutes.ORDER}/${id}`, locale });
  }

  //? Retrieve payment intent
  const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);

  //? Check if payment intent is valid
  if (
    paymentIntent.metadata.orderId == null ||
    paymentIntent.metadata.orderId !== order.id
  ) {
    return notFound();
  }

  //? Check if payment is successful
  const isSuccess = paymentIntent.status === "succeeded";

  //? Is payment is succeeded send the purchase receipt by email
  if (isSuccess) {
    sendPurchaseReceipt({
      order: {
        ...order,
        itemsPrice: order.itemsPrice.toString(),
        shippingPrice: order.shippingPrice.toString(),
        taxPrice: order.taxPrice.toString(),
        totalPrice: order.totalPrice.toString(),
        shippingAddress: convertToPlainObject(
          order.shippingAddress,
        ) as ShippingAddress,
        orderItems: order.orderItems.map((oi) => ({
          ...oi,
          price: oi.price.toString(),
        })),
        user: {
          name: order.user.name || "client name",
          email: order.user.email || "",
        },
        paymentResult: (order.paymentResult as PaymentResult) || {
          id: "",
          status: "",
          pricePaid: "",
          email_address: "",
        },
      },
    });
  } else {
    return redirect({
      href: `${appRoutes.ORDER}/${id}`,
      locale,
    });
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-6">
      <AppLink href={appRoutes.HOME}>
        <AppImage
          alt={t("logoAlt")}
          src="/images/logo.svg"
          width={80}
          height={80}
        />
      </AppLink>

      <div className="flex flex-col gap-6 items-center">
        <h1 className="h1-bold">{t("thanks")}</h1>
        <div>{t("processing")}</div>

        <AppLinkButton href={`${appRoutes.ORDER}/${id}`}>
          {t("viewOrder")}
        </AppLinkButton>
      </div>
    </div>
  );
};

export default SuccessPage;
