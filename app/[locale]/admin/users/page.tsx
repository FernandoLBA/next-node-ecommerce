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
import { deleteUserById, getAllUsers } from "@/lib/actions/user.actions";
import { ADMIN_PAGE_SIZE, appRoutes, userRoles } from "@/lib/constants";
import { formatId } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Users",
};

const AdminUsersPage = async (props: {
  searchParams: Promise<{
    page: string;
    query: string;
  }>;
}) => {
  const { page = "1", query } = await props.searchParams;
  const users = await getAllUsers({
    page: Number(page),
    query,
    limit: ADMIN_PAGE_SIZE,
  });

  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-3">
        <h1 className="h2-bold">Users</h1>
        {query && (
          <div>
            Filtered by <i>&quot;{query}&quot;</i>{" "}
            <Link href={appRoutes.ADMIN_USERS}>
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
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{formatId(user.id)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role === userRoles.USER ? (
                    <Badge variant="secondary">{userRoles.USER}</Badge>
                  ) : (
                    <Badge>{userRoles.ADMIN}</Badge>
                  )}
                </TableCell>
                <TableCell className="flex-start gap-2">
                  <Button variant="outline" size="sm">
                    <Link href={`${appRoutes.ADMIN_USERS}/${user.id}`}>
                      Edit
                    </Link>
                  </Button>

                  <DeleteDialog id={user.id} action={deleteUserById} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {users.totalPages > 1 && (
          <Pagination page={Number(page) || 1} totalPages={users.totalPages} />
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
