import CategoryForm from "@/components/admin/category-form";
import { getCategoryById } from "@/lib/actions/category.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Category",
};

const EditCategoryPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const category = await getCategoryById(id);

  if (!category) throw new Error("Category not found");

  return (
    <div className="space-y-8 mx-auto">
      <h1 className="h2-bold">Update Category</h1>

      <CategoryForm
        type="Update"
        categoryId={category.id}
        category={category}
      />
    </div>
  );
};

export default EditCategoryPage;
