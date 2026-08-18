"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { usePathname } from "@/i18n/routing";
import { appRoutes } from "@/lib/constants";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const AdminSearch = () => {
  const t = useTranslations("AdminPages");
  const pathname = usePathname();
  const formActionUrl = pathname.includes(appRoutes.ADMIN_ORDERS)
    ? appRoutes.ADMIN_ORDERS
    : pathname.includes(appRoutes.ADMIN_USERS)
      ? appRoutes.ADMIN_USERS
      : appRoutes.ADMIN_PRODUCTS
        ? appRoutes.ADMIN_PRODUCTS
        : appRoutes.ADMIN_CATEGORIES;
  const searchParams = useSearchParams();
  const [queryValue, setQueryValue] = useState(searchParams.get("query") || "");

  return (
    <form action={formActionUrl} method="GET">
      <Input
        type="search"
        placeholder={t("products.adminSearch.placeholder")}
        name="query"
        className="md:w-25 lg:w-75"
        value={queryValue}
        onChange={(e) => setQueryValue(e.target.value)}
      />

      <Button className="sr-only" type="submit">
        {t("products.adminSearch.searchButton")}
      </Button>
    </form>
  );
};

export default AdminSearch;
