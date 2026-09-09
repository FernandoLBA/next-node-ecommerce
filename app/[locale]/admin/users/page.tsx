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
import { deleteUserById, getAllUsers } from "@/lib/actions/user.actions";
import { ADMIN_PAGE_SIZE, appRoutes, userRoles } from "@/lib/constants";
import { cn, formatId } from "@/lib/utils";
import { User } from "@/types";
import { X } from "lucide-react";

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
      <div className="flex-col gap-3">
        <h1 className="h2-bold">Users</h1>
        {query && (
          <div className="flex-start text-sm text-muted-foreground gap-2 mt-2">
            Filtered by <i>&quot;{query}&quot;</i>{" "}
            <AppLink
              href={appRoutes.ADMIN_USERS}
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
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.data.map((user: User) => (
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
                  <AppButton variant="outline" size="sm">
                    <AppLink href={`${appRoutes.ADMIN_USERS}/${user.id}`}>
                      Edit
                    </AppLink>
                  </AppButton>

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
