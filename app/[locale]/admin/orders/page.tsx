import { Metadata } from "next";

import { AppButton } from "@/components/shared/app-button/app-button";
import { AppLink } from "@/components/shared/app-link/app-link";
import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteOrderById, getAllOrders } from "@/lib/actions/order.actions";
import { ADMIN_PAGE_SIZE, appRoutes } from "@/lib/constants";
import { cn, formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Locale, Order } from "@/types";
import { X } from "lucide-react";
import { getLocale } from "next-intl/server";
import { getLanguage } from "../../../../lib/utils";

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
      <div className="flex-col gap-3">
        <h1 className="h2-bold">{currentLanguage.AdminPages.orders.title}</h1>
        {query && (
          <div className="flex-start text-sm text-muted-foreground gap-2 mt-2">
            Filtered by <i>&quot;{query}&quot;</i>{" "}
            <AppLink
              href={appRoutes.ADMIN_ORDERS}
              className={cn(buttonVariants(), "w-6 h-6")}
            >
              <X />
            </AppLink>
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
            {orders.data.map((order: Order) => (
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
                  <AppButton size="sm" variant="outline">
                    <AppLink href={`${appRoutes.ORDER}/${order.id}`}>
                      {
                        currentLanguage.AdminPages.orders.tableHeaders.actions
                          .detailsButton
                      }
                    </AppLink>
                  </AppButton>

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
