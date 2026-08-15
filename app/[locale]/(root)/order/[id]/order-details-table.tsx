"use client";

import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { toast } from "sonner";

import AppImage from "@/components/ui/app-image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@/i18n/routing";
import {
  approvePayPalOrder,
  createPayPalOrder,
  updateOrderToDeliveredCOD,
  updateOrderToPaidCOD,
} from "@/lib/actions/order.actions";
import { appRoutes, paymentMethods } from "@/lib/constants";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Order } from "@/types";
import { useTransition } from "react";
import MarkingButton from "./marking-button";
import StripePayment from "./stripe-payment";

const PrintLoadingState = () => {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();
  let status = "";

  if (isPending) {
    status = "Loading PayPal...";
  } else if (isRejected) {
    status = "Error loading PayPal";
  }

  return status;
};

const OrderDetailsTable = ({
  order,
  payPalClientId,
  isAdmin,
  stripeClientSecret = null,
}: {
  order: Omit<Order, "paymentResult">;
  payPalClientId: string;
  isAdmin: boolean;
  stripeClientSecret: string | null;
}) => {
  const {
    id,
    shippingAddress,
    orderItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isPaid,
    isDelivered,
    paidAt,
    deliveredAt,
  } = order;
  const [isPending, startTransition] = useTransition();

  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(order.id);

    if (!res.success) {
      toast.error(res.message || "Error creating PayPal order");
    }

    return res.data;
  };

  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(order.id, data);

    if (res.success) {
      toast.success("Payment successful");
    } else {
      toast.error(res.message || "Error approving PayPal order");
    }
  };

  const handlePaid = async () => {
    startTransition(async () => {
      const res = await updateOrderToPaidCOD(id);

      if (!res.success) {
        toast.error(res.message);

        return;
      }

      toast.success(res.message);
    });
  };

  const handleDelivered = async () => {
    startTransition(async () => {
      const res = await updateOrderToDeliveredCOD(id);

      if (!res.success) {
        toast.error(res.message);

        return;
      }

      toast.success(res.message);
    });
  };

  return (
    <>
      <h1 className="py-4 text-2xl">Order {formatId(id)}</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-y-4 overflow-x-auto">
          <Card>
            <CardContent className="px-4 gap-4">
              <h2 className="text-xl pb-4">Payment Method</h2>
              <p className="pb-2">{paymentMethod}</p>
              {isPaid ? (
                <Badge variant="secondary">
                  Paid at {formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Not Paid</Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="px-4 gap-4">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p className="pb-2">
                {shippingAddress.streetAddress}, {shippingAddress.city}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              {isDelivered ? (
                <Badge variant="secondary">
                  Delivered at {formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Not Delivered</Badge>
              )}
            </CardContent>
          </Card>

          <Card className="mb-4 md:mb-0">
            <CardContent className="px-4 gap-4">
              <h2 className="text-xl pb-4">Order Items</h2>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {orderItems?.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`${appRoutes.PRODUCTS}/${item.slug}`}
                          className="flex items-center"
                        >
                          <AppImage
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className="px-2">{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="px-2">{item.qty}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="px-2">
                          {formatCurrency(Number(item.price))}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-2 md:col-span-1 space-y-4 overflow-x-auto">
          <Card>
            <CardContent className="px-4 gap-4 space-y-4">
              <div className="flex-between">
                <div>Items</div>
                <div>{formatCurrency(itemsPrice)}</div>
              </div>
              <div className="flex-between">
                <div>Tax</div>
                <div>{formatCurrency(taxPrice)}</div>
              </div>
              <div className="flex-between">
                <div>Shipping</div>
                <div>{formatCurrency(shippingPrice)}</div>
              </div>
              <div className="flex-between">
                <div>Total</div>
                <div>{formatCurrency(totalPrice)}</div>
              </div>

              {/* // * PayPal Payment */}
              {!isPaid && paymentMethod === paymentMethods.paypal && (
                <div>
                  <PayPalScriptProvider options={{ clientId: payPalClientId }}>
                    <PrintLoadingState />
                    <PayPalButtons
                      createOrder={handleCreatePayPalOrder}
                      onApprove={handleApprovePayPalOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              )}

              {/* //* STRIPE */}
              {!isPaid && paymentMethod === paymentMethods.stripe && (
                <div>
                  <StripePayment
                    clientSecret={stripeClientSecret as string}
                    orderId={order.id}
                    priceInCents={Number(order.totalPrice) * 100}
                  />
                </div>
              )}

              {/* //* Cash On Delivery */}
              {isAdmin &&
                !isPaid &&
                paymentMethod === paymentMethods.cashOnDelivery && (
                  <MarkingButton
                    isPending={isPending}
                    action={handlePaid}
                    text="paid"
                  />
                )}

              {isAdmin && isPaid && !isDelivered && (
                <MarkingButton
                  isPending={isPending}
                  action={handleDelivered}
                  text="delivered"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsTable;
