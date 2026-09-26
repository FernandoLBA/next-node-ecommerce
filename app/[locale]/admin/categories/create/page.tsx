import CategoryForm from "@/components/admin/category-form";
import { getLanguage } from "@/lib/utils";
import { Category, Locale } from "@/types";
import { Metadata } from "next";
import { getLocale } from "next-intl/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale();
  const { currentLanguage } = getLanguage(locale as Locale);

  return { title: "Create category" };
};

const CreateCategoryPage = async () => {
  const locale = await getLocale();
  const { currentLanguage } = getLanguage(locale as Locale);

  return (
    <>
      <h1 className="h2-bold">Create Category</h1>

      <div className="my-8">
        <CategoryForm type="Create" categoryId="1" category={{} as Category} />
      </div>
    </>
  );
};

export default CreateCategoryPage;
