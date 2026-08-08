import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getUserById } from "@/lib/actions/user.actions";
import { UpdateUser } from "@/types";
import UpdateUserForm from "./update-user-form";

export const metadata: Metadata = {
  title: "Update User",
};

const AdminUsersPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await props.params;
  const user = await getUserById(id);

  if (!user) notFound();

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h2 className="h2-bold">Update User</h2>

      <UpdateUserForm user={user as UpdateUser} />
    </div>
  );
};

export default AdminUsersPage;
