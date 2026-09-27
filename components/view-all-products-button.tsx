import { appRoutes } from "@/lib/constants";
import { getTranslations } from "next-intl/server";
import { AppLinkButton } from "./shared/app-link-button/app-link-button";

const ViewAllProductsButton = async () => {
  const t = await getTranslations("Common");

  return (
    <div className="flex-center w-full my-8">
      <AppLinkButton className="w-full md:w-fit" href={appRoutes.SEARCH}>
        {t("viewAllProducts")}
      </AppLinkButton>
    </div>
  );
};

export default ViewAllProductsButton;
