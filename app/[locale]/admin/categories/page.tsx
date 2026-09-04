import { Metadata } from "next";
import { getLocale } from "next-intl/server";

import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
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
  deleteCategoryById,
  getAllCategories,
} from "@/lib/actions/category.actions";
import { ADMIN_PAGE_SIZE, appRoutes } from "@/lib/constants";
import { formatDateTime, formatId, getLanguage } from "@/lib/utils";
import { Category, Locale } from "@/types";

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale();
  const { currentLanguage } = getLanguage(locale as Locale);

  return {
    title: currentLanguage.AdminPages.categories.title,
  };
};

type AdminCategoriesPageProps = {
  searchParams: Promise<{
    page: string;
    query: string;
    createdAt?: Date;
  }>;
};

const AdminCategoriesPage = async (props: AdminCategoriesPageProps) => {
  const locale = await getLocale();
  const searchParams = await props.searchParams;
  const { currentLanguage } = getLanguage(locale as Locale);
  const page = Number(searchParams.page) || 1;
  const query = searchParams.query || "";

  const categories = await getAllCategories({
    page,
    limit: ADMIN_PAGE_SIZE,
    query,
  });

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <div className="flex items-baseline gap-3">
          <h1 className="h2-bold">
            {currentLanguage.AdminPages.categories.title}
          </h1>
          {query && (
            <div className="flex items-center gap-2">
              {currentLanguage.AdminPages.categories.filters.filteredBy}{" "}
              <i>&quot;{query}&quot;</i>{" "}
              <Link href={appRoutes.ADMIN_CATEGORIES}>
                <Button variant="outline" size="sm">
                  {
                    currentLanguage.AdminPages.categories.filters
                      .cleanFilterButton
                  }
                </Button>
              </Link>
            </div>
          )}
        </div>

        <Button>
          <Link href={appRoutes.ADMIN_CATEGORIES_CREATE}>
            {currentLanguage.AdminPages.categories.createButton}
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="uppercase">
            <TableHead>
              {currentLanguage.AdminPages.categories.tableHeaders.id}
            </TableHead>
            <TableHead>
              {currentLanguage.AdminPages.categories.tableHeaders.name}
            </TableHead>
            <TableHead>
              {currentLanguage.AdminPages.categories.tableHeaders.createdDate}
            </TableHead>
            <TableHead className="w-25">
              {currentLanguage.AdminPages.categories.tableHeaders.actions.title}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {categories.data.map((c: Category) => (
            <TableRow key={c.id}>
              <TableCell>{formatId(c.id)}</TableCell>
              <TableCell>{c.name}</TableCell>
              <TableCell>{formatDateTime(c.createdAt).dateTime}</TableCell>

              <TableCell className="flex-start gap-2">
                <Button size="sm" variant="outline">
                  <Link href={`${appRoutes.ADMIN_CATEGORIES}/${c.id}`}>
                    {
                      currentLanguage.AdminPages.categories.tableHeaders.actions
                        .editButton
                    }
                  </Link>
                </Button>

                <DeleteDialog id={c.id} action={deleteCategoryById} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {categories?.totalPages > 1 && (
        <Pagination page={page} totalPages={categories.totalPages} />
      )}
    </div>
  );
};

export default AdminCategoriesPage;
