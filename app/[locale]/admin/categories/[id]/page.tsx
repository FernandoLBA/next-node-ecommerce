import CategoryForm from "@/components/admin/category-form";
import { getCategoryById } from "@/lib/actions/category.actions";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("AdminPages.categories");

  return { title: t("updateTitle") };
};

const EditCategoryPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const t = await getTranslations("AdminPages.categories");
  const category = await getCategoryById(id);

  if (!category) throw new Error("Category not found");

  return (
    <div className="space-y-8 mx-auto">
      <h1 className="h2-bold">{t("updateTitle")}</h1>

      <CategoryForm
        type="Update"
        categoryId={category.id}
        category={category}
      />
    </div>
  );
};

export default EditCategoryPage;
