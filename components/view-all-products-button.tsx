import { Link } from "@/i18n/routing";
import { Button } from "./ui/button";
import { appRoutes } from "@/lib/constants";

const ViewAllProductsButton = () => {
  return (
    <div className="flex justify-center items-center my-8">
      <Button className="px-8 py-4 text-lg font-semibold">
        <Link href={appRoutes.SEARCH}>View All Products</Link>
      </Button>
    </div>
  );
};

export default ViewAllProductsButton;
