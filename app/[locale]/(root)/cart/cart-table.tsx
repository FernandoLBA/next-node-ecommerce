"use client";

import { ArrowRight, Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";

import AppImage from "@/components/ui/app-image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LoaderIcon from "@/components/ui/loader-icon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, useRouter } from "@/i18n/routing";
import { addItemToCart, removeItemFromcart } from "@/lib/actions/cart.actions";
import { appRoutes } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { Cart } from "@/types";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const t = useTranslations("CartPage");
  const [isPending, startTransition] = useTransition();
  const [isGoingToCkeckout, startGoingToCkeckoutTransition] = useTransition();

  return (
    <>
      <h1 className="py-4 h2-bold">{t("title")}</h1>
      {/* //* CART EMPTY MESSAGE */}
      {!cart || cart.items.length === 0 ? (
        <div>
          {t("status.empty")}{" "}
          <Link href={appRoutes.HOME} className="underline">
            {t("status.goShoppingLink")}
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            {/* //* CART TABLE */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.item")}</TableHead>

                  <TableHead className="text-center">
                    {t("table.quantity")}
                  </TableHead>

                  <TableHead className="text-right">
                    {t("table.price")}
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link
                        href={`${appRoutes.PRODUCTS}/${item.slug}`}
                        className="flex items-center rounded-xl"
                      >
                        <AppImage
                          className="rounded-md"
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        />

                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>

                    <TableCell>
                      <div className="flex-between bg-input rounded-md">
                        <Button
                          disabled={isPending}
                          type="button"
                          onClick={() =>
                            startTransition(async () => {
                              const res = await removeItemFromcart(
                                item.productId,
                              );

                              if (!res.success) {
                                toast.error(res.message);
                              }
                            })
                          }
                        >
                          {isPending ? <LoaderIcon /> : <Minus />}
                        </Button>

                        <span className="px-2">{item.qty}</span>

                        <Button
                          disabled={isPending}
                          type="button"
                          onClick={() =>
                            startTransition(async () => {
                              const res = await addItemToCart(item);

                              if (!res.success) {
                                toast.error(res.message);
                              }
                            })
                          }
                        >
                          {isPending ? <LoaderIcon /> : <Plus />}
                        </Button>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <span>
                        {formatCurrency(Number(item.price) * item.qty)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* //* CART ACTIONS */}
          <Card className="flex justify-center mt-2 md:mt-0 max-h-44">
            <CardContent className="px-4">
              <div className="flex-between text-md">
                {t("cartActions.subTotal")} (
                {cart.items.reduce((acc, item) => acc + item.qty, 0)}
                ):{" "}
                <span className="font-bold">
                  {formatCurrency(cart.itemsPrice)}
                </span>
              </div>

              <div className="flex-between py-3 text-md">
                {t("cartActions.taxes")}:{" "}
                <span className="font-bold">
                  {formatCurrency(cart.taxPrice)}
                </span>
              </div>

              <div className="flex-between pb-3 text-md">
                {t("cartActions.shipping")}:{" "}
                <span className="font-bold">
                  {formatCurrency(cart.shippingPrice)}
                </span>
              </div>

              <Button
                className="w-full"
                disabled={isGoingToCkeckout}
                onClick={() =>
                  startGoingToCkeckoutTransition(() =>
                    router.push(appRoutes.SHIPPING_ADDRESS),
                  )
                }
              >
                {isGoingToCkeckout ? (
                  <LoaderIcon />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}{" "}
                {`${t("cartActions.goCheckout")} (${formatCurrency(cart.totalPrice)})`}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartTable;
