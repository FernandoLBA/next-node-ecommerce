import { Metadata } from "next";

import { auth } from "@/auth";
import CheckoutSteps from "@/components/shared/checkout-steps";
import AppImage from "@/components/ui/app-image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, redirect } from "@/i18n/routing";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { appRoutes } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { ShippingAddress } from "@/types";
import PlaceOrderForm from "./place-order-form";

export const metada: Metadata = {
  title: "Place Order",
};

const PlaceOrderPage = async (props: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await props.params;
  const cart = await getMyCart();
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) redirect({ href: appRoutes.SIGN_IN, locale });
  if (!cart) return null;

  const user = await getUserById(userId!);

  if (cart.items.length === 0) redirect({ href: appRoutes.CART, locale });
  if (!user.address) redirect({ href: appRoutes.SHIPPING_ADDRESS, locale });
  if (!user.paymentMethod) redirect({ href: appRoutes.PAYMENT_METHOD, locale });

  const userAddress = user.address as ShippingAddress;

  return (
    <>
      <CheckoutSteps current={3} />
      <h1 className="py-4 text-2xl">Place order</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="md:col-span-2 overflow-x-auto space-y-4">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p>{userAddress.fullName}</p>
              <p>
                {userAddress.streetAddress}, {userAddress.city},{" "}
                {userAddress.postalCode}, {userAddress.country}{" "}
              </p>
              <div className="mt-3">
                <Link href={appRoutes.SHIPPING_ADDRESS}>
                  <Button variant="outline">Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Payment Method</h2>
              <p>{user.paymentMethod}</p>

              <div className="mt-3">
                <Link href={appRoutes.PAYMENT_METHOD}>
                  <Button variant="outline">Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 gap-4">
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
                  {cart?.items.map((item) => (
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
        <div className="pt-4 md:pt-0">
          <Card>
            <CardContent className="p-4 gap-4 space-y-4">
              <div className="flex-between">
                <div>
                  Items({cart.items.reduce((acc, item) => acc + item.qty, 0)})
                </div>
                <div>{formatCurrency(cart.itemsPrice)}</div>
              </div>
              <div className="flex-between">
                <div>Tax</div>
                <div>{formatCurrency(cart.taxPrice)}</div>
              </div>
              <div className="flex-between">
                <div>Shipping</div>
                <div>{formatCurrency(cart.shippingPrice)}</div>
              </div>
              <div className="flex-between">
                <div>Total</div>
                <div>{formatCurrency(cart.totalPrice)}</div>
              </div>

              <PlaceOrderForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;
