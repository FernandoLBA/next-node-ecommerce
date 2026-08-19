import { Metadata } from "next";
import { getLocale } from "next-intl/server";

import Pagination from "@/components/shared/pagination";
import DeleteDialog from "@/components/shared/delete-dialog";
import StarIcon from "@/components/shared/star";
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
import {
  deleteProductById,
  getAllProducts,
} from "@/lib/actions/product.actions";
import { ADMIN_PAGE_SIZE, appRoutes } from "@/lib/constants";
import { formatCurrency, formatId, getLanguage } from "@/lib/utils";
import { Locale } from "@/types";

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale();
  const { currentLanguage } = getLanguage(locale as Locale);

  return {
    title: currentLanguage.AdminPages.products.title,
  };
};

type AdminProductsPageProps = {
  searchParams: Promise<{
    page: string;
    query: string;
    category: string;
  }>;
};

const AdminProductsPage = async (props: AdminProductsPageProps) => {
  const locale = await getLocale();
  const searchParams = await props.searchParams;
  const { currentLanguage } = getLanguage(locale as Locale);
  const page = Number(searchParams.page) || 1;
  const query = searchParams.query || "";
  const category = searchParams.category || "";

  const products = await getAllProducts({
    query,
    limit: ADMIN_PAGE_SIZE,
    page,
    category,
  });

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <div className="flex items-baseline gap-3">
          <h1 className="h2-bold">
            {currentLanguage.AdminPages.products.title}
          </h1>
          {query && (
            <div className="flex items-center gap-2">
              {currentLanguage.AdminPages.products.filters.filteredBy}{" "}
              <i>&quot;{query}&quot;</i>{" "}
              <Link href={appRoutes.ADMIN_PRODUCTS}>
                <Button variant="outline" size="sm">
                  {
                    currentLanguage.AdminPages.products.filters
                      .cleanFilterButton
                  }
                </Button>
              </Link>
            </div>
          )}
        </div>

        <Button>
          <Link href={appRoutes.ADMIN_PRODUCTS_CREATE}>
            {currentLanguage.AdminPages.products.createButton}
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="uppercase">
            <TableHead>
              {currentLanguage.AdminPages.products.tableHeaders.id}
            </TableHead>

            <TableHead>
              {currentLanguage.AdminPages.products.tableHeaders.name}
            </TableHead>

            <TableHead className="text-right">
              {currentLanguage.AdminPages.products.tableHeaders.price}
            </TableHead>

            <TableHead>
              {currentLanguage.AdminPages.products.tableHeaders.brand}
            </TableHead>

            <TableHead>
              {currentLanguage.AdminPages.products.tableHeaders.category}
            </TableHead>

            <TableHead>
              {currentLanguage.AdminPages.products.tableHeaders.stock}
            </TableHead>

            <TableHead>
              {currentLanguage.AdminPages.products.tableHeaders.rating}
            </TableHead>

            <TableHead className="w-25">
              {currentLanguage.AdminPages.products.tableHeaders.actions.title}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.data.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{formatId(product.id)}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(product.price as string)}
              </TableCell>
              <TableCell>{product.brand}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <StarIcon />
                  {product.rating as string}
                </div>
              </TableCell>
              <TableCell className="flex-start gap-2">
                <Button size="sm" variant="outline">
                  <Link href={`${appRoutes.ADMIN_PRODUCTS}/${product.id}`}>
                    {
                      currentLanguage.AdminPages.products.tableHeaders.actions
                        .editButton
                    }
                  </Link>
                </Button>

                <DeleteDialog id={product.id} action={deleteProductById} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {products?.totalPages > 1 && (
        <Pagination page={page} totalPages={products.totalPages} />
      )}
    </div>
  );
};

export default AdminProductsPage;
