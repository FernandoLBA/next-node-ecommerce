import Pagination from "@/components/shared/pagination";
import DeleteDialog from "@/components/shared/products/delete-dialog";
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
import { appRoutes, PAGE_SIZE } from "@/lib/constants";
import { formatCurrency, formatId } from "@/lib/utils";

const AdminProductsPage = async (props: {
  searchParams: Promise<{
    page: string;
    query: string;
    category: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || "";
  const category = searchParams.category || "";

  const products = await getAllProducts({
    query: searchText,
    limit: PAGE_SIZE,
    page,
    category,
  });

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Products</h1>
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
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.rating as string}</TableCell>
              <TableCell className="flex-start gap-2">
                <Button size="sm">
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
