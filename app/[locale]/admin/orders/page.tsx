import { Metadata } from "next";

import Pagination from "@/components/shared/pagination";
import DeleteDialog from "@/components/shared/delete-dialog";
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
import { Link } from "@/i18n/routing";
import { deleteOrderById, getAllOrders } from "@/lib/actions/order.actions";
import { ADMIN_PAGE_SIZE, appRoutes } from "@/lib/constants";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { getLocale } from "next-intl/server";
import { getLanguage } from "../../../../lib/utils";
import { Locale } from "@/types";

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale();
  const { currentLanguage } = getLanguage(locale as Locale);

  return { title: currentLanguage.AdminPages.orders.title };
};

type AdminOrdersPageProps = {
  searchParams: Promise<{ page: string; query: string }>;
};

const AdminOrdersPage = async (props: AdminOrdersPageProps) => {
  const locale = await getLocale();
  const { page = "1", query } = await props.searchParams;
  const orders = await getAllOrders({
    page: Number(page),
    limit: ADMIN_PAGE_SIZE,
    query,
  });
  const { currentLanguage } = getLanguage(locale as Locale);

  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-3">
        <h1 className="h2-bold">{currentLanguage.AdminPages.orders.title}</h1>
        {query && (
          <div>
            Filtered by <i>&quot;{query}&quot;</i>{" "}
            <Link href={appRoutes.ADMIN_ORDERS}>
              <Button variant="outline" size="sm">
                Remove Filters
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="uppercase">
              <TableHead>
                {currentLanguage.AdminPages.orders.tableHeaders.id}
              </TableHead>

              <TableHead>
                {currentLanguage.AdminPages.orders.tableHeaders.buyer}
              </TableHead>

              <TableHead>
                {currentLanguage.AdminPages.orders.tableHeaders.createdDate}
              </TableHead>

              <TableHead className="text-right">
                {currentLanguage.AdminPages.orders.tableHeaders.total}
              </TableHead>

              <TableHead>
                {currentLanguage.AdminPages.orders.tableHeaders.paid}
              </TableHead>

              <TableHead>
                {currentLanguage.AdminPages.orders.tableHeaders.delivered}
              </TableHead>

              <TableHead>
                {currentLanguage.AdminPages.orders.tableHeaders.actions.title}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>

                <TableCell>{order.user.name}</TableCell>

                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>

                <TableCell align="right">
                  {formatCurrency(Number(order.totalPrice))}
                </TableCell>

                <TableCell>
                  {order.isPaid && order.paidAt ? (
                    <Badge>{formatDateTime(order.paidAt).dateTime}</Badge>
                  ) : (
                    <Badge variant="destructive">
                      {
                        currentLanguage.AdminPages.orders.tableHeaders
                          .notPaidStatus
                      }
                    </Badge>
                  )}
                </TableCell>

                <TableCell>
                  {order.isDelivered && order.deliveredAt ? (
                    <Badge>{formatDateTime(order.deliveredAt).dateTime}</Badge>
                  ) : (
                    <Badge variant="destructive">
                      {
                        currentLanguage.AdminPages.orders.tableHeaders
                          .notDeliveredStatus
                      }
                    </Badge>
                  )}
                </TableCell>

                <TableCell className="flex-start gap-2">
                  <Button size="sm" variant="outline">
                    <Link href={`${appRoutes.ORDER}/${order.id}`}>
                      {
                        currentLanguage.AdminPages.orders.tableHeaders.actions
                          .detailsButton
                      }
                    </Link>
                  </Button>

                  <DeleteDialog id={order.id} action={deleteOrderById} />
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

export default AdminOrdersPage;
