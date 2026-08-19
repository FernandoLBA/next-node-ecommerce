import { Metadata } from "next";
import { getLocale } from "next-intl/server";
import Link from "next/link";

import Pagination from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMyOrders } from "@/lib/actions/order.actions";
import { appRoutes } from "@/lib/constants";
import {
  formatCurrency,
  formatDateTime,
  formatId,
  getLanguage,
} from "@/lib/utils";
import { Locale } from "@/types";

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale();
  const { currentLanguage } = getLanguage(locale as Locale);

  return {
    title: currentLanguage.Orders.title,
    description: currentLanguage.Orders.description,
  };
};

const OrdersPage = async (props: {
  searchParams: Promise<{ page: string }>;
}) => {
  const locale = await getLocale();
  const { page = 1 } = await props.searchParams;
  const orders = await getMyOrders({ page: Number(page) });
  const { currentLanguage } = getLanguage(locale as Locale);

  return (
    <div className="space-y-2">
      <h1 className="h2-bold">{currentLanguage.Orders.title}</h1>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{currentLanguage.Orders.tableHeaders.id}</TableHead>

              <TableHead>{currentLanguage.Orders.tableHeaders.date}</TableHead>

              <TableHead>{currentLanguage.Orders.tableHeaders.total}</TableHead>

              <TableHead>{currentLanguage.Orders.tableHeaders.paid}</TableHead>

              <TableHead>
                {currentLanguage.Orders.tableHeaders.delivered}
              </TableHead>

              <TableHead>
                {currentLanguage.Orders.tableHeaders.actions.title}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>

                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>

                <TableCell>
                  {formatCurrency(Number(order.totalPrice))}
                </TableCell>

                <TableCell>
                  {order.isPaid && order.paidAt ? (
                    <Badge variant="secondary">
                      {formatDateTime(order.paidAt).dateTime}
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      {currentLanguage.Orders.tableHeaders.actions.notPaidState}
                    </Badge>
                  )}
                </TableCell>

                <TableCell>
                  {order.isDelivered && order.deliveredAt ? (
                    <Badge variant="secondary">
                      {formatDateTime(order.deliveredAt).dateTime}
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      {
                        currentLanguage.Orders.tableHeaders.actions
                          .notDeliveredState
                      }
                    </Badge>
                  )}
                </TableCell>

                <TableCell>
                  <Button variant="outline">
                    <Link href={`${appRoutes.ORDER}/${order.id}`}>
                      {
                        currentLanguage.Orders.tableHeaders.actions
                          .detailsButton
                      }
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {orders.totalPages > 1 && (
          <Pagination page={Number(page) || 1} totalPages={orders.totalPages} />
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
