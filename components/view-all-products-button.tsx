import { getTranslations } from "next-intl/server";

import { appRoutes } from "@/lib/constants";
import { AppLinkButton } from "./shared/app-link-button/app-link-button";

const ViewAllProductsButton = async () => {
  const t = await getTranslations("Common");

  return (
    <div className="flex justify-center items-center my-8">
      <AppLinkButton href={appRoutes.SEARCH}>{t("viewAllProducts")}</AppLinkButton>
    </div>
  );
};

export default ViewAllProductsButton;
