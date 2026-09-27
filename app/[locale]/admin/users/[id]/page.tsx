import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { getUserById } from "@/lib/actions/user.actions";
import { UpdateUser } from "@/types";
import UpdateUserForm from "./update-user-form";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("AdminPages.users.updateForm");

  return { title: t("metaTitle") };
};

const AdminUsersPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await props.params;
  const t = await getTranslations("AdminPages.users.updateForm");
  const user = await getUserById(id);

  if (!user) notFound();

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h2 className="h2-bold">{t("title")}</h2>

      <UpdateUserForm user={user as UpdateUser} />
    </div>
  );
};

export default AdminUsersPage;
