import { BadgeDollarSign, Barcode, CreditCard, Tag, Users } from "lucide-react";
import { Metadata } from "next";
import { getLocale } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@/i18n/routing";
import { getOrderSummary } from "@/lib/actions/order.actions";
import { appRoutes } from "@/lib/constants";
import {
  formatCurrency,
  formatDateTime,
  formatNumber,
  getLanguage,
} from "@/lib/utils";
import type { Locale, OrderSummary } from "@/types";
import Charts from "./charts";

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale();
  const { currentLanguage } = getLanguage(locale as Locale);

  return { title: currentLanguage.AdminPages.overview.title };
};

const AdminOverviewPage = async () => {
  const locale = await getLocale();
  const summary: OrderSummary = await getOrderSummary();
  const { currentLanguage } = getLanguage(locale as Locale);

  return (
    <div className="space-y-2">
      <h1 className="h2-bold">{currentLanguage.AdminPages.overview.title}</h1>

      {/* //* STATS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 pb-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              {currentLanguage.AdminPages.overview.stats.revenue}
            </CardTitle>
            <BadgeDollarSign />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.totalSales._sum.totalPrice)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              {currentLanguage.AdminPages.overview.stats.sales}
            </CardTitle>

            <CreditCard />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.ordersCount)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              {currentLanguage.AdminPages.overview.stats.customers}
            </CardTitle>

            <Users />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.usersCount)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              {currentLanguage.AdminPages.overview.stats.products}
            </CardTitle>

            <Barcode />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.productsCount)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              {currentLanguage.AdminPages.overview.stats.categories}
            </CardTitle>

            <Tag />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.categoriesCount)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* //* GRAPH AND TABLE SECTION */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="h3-bold">
              {currentLanguage.AdminPages.overview.graph.title}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Charts data={{ salesData: summary.salesData }} />
          </CardContent>
        </Card>

        <Card className="col-span-4 md:col-span-3">
          <CardHeader>
            <CardTitle className="h3-bold">
              {currentLanguage.AdminPages.overview.recentSalesTable.title}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="uppercase">
                  <TableHead>
                    {
                      currentLanguage.AdminPages.overview.recentSalesTable
                        .tableHeaders.buyer
                    }
                  </TableHead>

                  <TableHead>
                    {
                      currentLanguage.AdminPages.overview.recentSalesTable
                        .tableHeaders.date
                    }
                  </TableHead>

                  <TableHead>
                    {
                      currentLanguage.AdminPages.overview.recentSalesTable
                        .tableHeaders.total
                    }
                  </TableHead>

                  <TableHead>
                    {
                      currentLanguage.AdminPages.overview.recentSalesTable
                        .tableHeaders.actions.title
                    }
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {summary.latestSales.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {order?.user?.name
                        ? order.user.name
                        : currentLanguage.AdminPages.overview.recentSalesTable
                            .tableHeaders.deletedUser}
                    </TableCell>

                    <TableCell>
                      {formatDateTime(order.createdAt).dateOnly}
                    </TableCell>

                    <TableCell>
                      {formatCurrency(order.totalPrice as string)}
                    </TableCell>

                    <TableCell>
                      <Button variant="outline">
                        <Link href={`${appRoutes.ORDER}/${order.id}`}>
                          {
                            currentLanguage.AdminPages.overview.recentSalesTable
                              .tableHeaders.actions.detailsButton
                          }
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
