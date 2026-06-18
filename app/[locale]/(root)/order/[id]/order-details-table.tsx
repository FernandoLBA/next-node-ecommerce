"use client";

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
import { appRoutes } from "@/lib/constants";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Order } from "@/types";

const OrderDetailsTable = ({ order }: { order: Order }) => {
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

          <Card className="my-2">
            <CardContent className="px-4 gap-4">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p className="pb-2">
                {shippingAddress.streetAddress}, {shippingAddress.city}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              {true ? (
                <Badge variant="secondary">
                  Delivered at {formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Not Delivered</Badge>
              )}
            </CardContent>
          </Card>

          <Card>
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

        <div className="col-span-2 md:col-span-1 space-y-4 mt-2 md:mt-0 overflow-x-auto">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsTable;
