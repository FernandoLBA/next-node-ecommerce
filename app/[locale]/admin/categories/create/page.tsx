import CategoryForm from "@/components/admin/category-form";
import { Category } from "@/types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("AdminPages.categories");

  return { title: t("createTitle") };
};

const CreateCategoryPage = async () => {
  const t = await getTranslations("AdminPages.categories");

  return (
    <>
      <h1 className="h2-bold">{t("createTitle")}</h1>

      <div className="my-8">
        <CategoryForm type="Create" categoryId="1" category={{} as Category} />
      </div>
    </>
  );
};

export default CreateCategoryPage;
