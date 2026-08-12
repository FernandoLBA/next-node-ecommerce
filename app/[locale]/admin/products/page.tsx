import Pagination from "@/components/shared/pagination";
import DeleteDialog from "@/components/shared/products/delete-dialog";
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
import { deleteproduct, getAllProducts } from "@/lib/actions/product.actions";
import { ADMIN_PAGE_SIZE, appRoutes } from "@/lib/constants";
import { formatCurrency, formatId } from "@/lib/utils";
import { Star } from "lucide-react";

type AdminProductsPageProps = {
  searchParams: Promise<{
    page: string;
    query: string;
    category: string;
  }>;
};

const AdminProductsPage = async (props: AdminProductsPageProps) => {
  const searchParams = await props.searchParams;
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
          <h1 className="h2-bold">Products</h1>
          {query && (
            <div>
              Filtered by <i>&quot;{query}&quot;</i>{" "}
              <Link href={appRoutes.ADMIN_PRODUCTS}>
                <Button variant="outline" size="sm">
                  Remove Filters
                </Button>
              </Link>
            </div>
          )}
        </div>

        <Button>
          <Link href={appRoutes.ADMIN_PRODUCTS_CREATE}>Create Product</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>NAME</TableHead>
            <TableHead className="text-right">PRICE</TableHead>
            <TableHead>BRAND</TableHead>
            <TableHead>CATEGORY</TableHead>
            <TableHead>STOCK</TableHead>
            <TableHead>RATING</TableHead>
            <TableHead className="w-25">ACTIONS</TableHead>
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
                    Edit
                  </Link>
                </Button>

                <DeleteDialog id={product.id} action={deleteproduct} />
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
