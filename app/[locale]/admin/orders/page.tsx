import { Metadata } from "next";

import Pagination from "@/components/shared/pagination";
import DeleteDialog from "@/components/shared/products/delete-dialog";
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
import { appRoutes } from "@/lib/constants";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Orders",
};

type AdminOrdersPageProps = {
  searchParams: Promise<{ page: string; query: string }>;
};

const AdminOrdersPage = async (props: AdminOrdersPageProps) => {
  const { page = "1", query } = await props.searchParams;
  const orders = await getAllOrders({
    page: Number(page),
    limit: 10,
    query,
  });

  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-3">
        <h1 className="h2-bold">Orders</h1>
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
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>BUYER</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAID</TableHead>
              <TableHead>DELIVERED</TableHead>
              <TableHead>ACTIONS</TableHead>
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
                <TableCell>
                  {formatCurrency(Number(order.totalPrice))}
                </TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt ? (
                    <Badge variant="secondary">
                      {formatDateTime(order.paidAt).dateTime}
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Not paid</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt ? (
                    <Badge variant="secondary">
                      {formatDateTime(order.deliveredAt).dateTime}
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Not delivered</Badge>
                  )}
                </TableCell>
                <TableCell className="flex-start gap-2">
                  <Button size="sm">
                    <Link href={`${appRoutes.ORDER}/${order.id}`}>Details</Link>
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
