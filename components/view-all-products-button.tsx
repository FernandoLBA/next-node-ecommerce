import { appRoutes } from "@/lib/constants";
import { AppLink } from "./shared/app-link/app-link";
import { buttonVariants } from "./ui/button";

const ViewAllProductsButton = () => {
  return (
    <div className="flex justify-center items-center my-8">
      <AppLink href={appRoutes.SEARCH} className={buttonVariants()}>
        View All Products
      </AppLink>
    </div>
  );
};

export default ViewAllProductsButton;
