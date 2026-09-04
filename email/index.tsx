import dotenv from "dotenv";

import { getAppSettings } from "@/lib/actions/app-setting.actions";
import { SENDER_EMAIL } from "@/lib/constants";
import { resend } from "@/lib/resend";
import { Order } from "@/types";
import PurchaseReceiptEmail from "./purchase-receipt";

dotenv.config();

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
  const settings = await getAppSettings();

  return await resend.emails.send({
    from: `${settings?.appName ?? "Shop Name"} <${SENDER_EMAIL}>`,
    to: "fernandolba.uiux@gmail.com", // order.user.email,
    subject: `Order confirmation ${order.id}`,
    react: <PurchaseReceiptEmail order={order} />,
  });
};
