"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { usePathname } from "@/i18n/routing";
import { appRoutes } from "@/lib/constants";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const AdminSearch = () => {
  const pathname = usePathname();
  const formActionUrl = pathname.includes(appRoutes.ADMIN_ORDERS)
    ? appRoutes.ADMIN_ORDERS
    : pathname.includes(appRoutes.ADMIN_USERS)
      ? appRoutes.ADMIN_USERS
      : appRoutes.ADMIN_PRODUCTS;
  const searchParams = useSearchParams();
  const [queryValue, setQueryValue] = useState(searchParams.get("query") || "");

  return (
    <form action={formActionUrl} method="GET">
      <Input
        type="search"
        placeholder="Search..."
        name="query"
        className="md:w-25 lg:w-75"
        value={queryValue}
        onChange={(e) => setQueryValue(e.target.value)}
      />

      <Button className="sr-only" type="submit">
        Search
      </Button>
    </form>
  );
};

export default AdminSearch;
