import { getTranslations } from "next-intl/server";

import { appRoutes } from "@/lib/constants";
import { AppLink } from "./shared/app-link/app-link";
import { buttonVariants } from "./ui/button";

const ViewAllProductsButton = async () => {
  const t = await getTranslations("Common");

  return (
    <div className="flex justify-center items-center my-8">
      <AppLink href={appRoutes.SEARCH} className={buttonVariants()}>
        {t("viewAllProducts")}
      </AppLink>
    </div>
  );
};

export default ViewAllProductsButton;
