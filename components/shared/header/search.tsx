import { SearchIcon } from "lucide-react";
import { getLocale } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCategories } from "@/lib/actions/product.actions";
import { appRoutes } from "@/lib/constants";
import { getLanguage } from "@/lib/utils";
import { Locale } from "@/types";

const Search = async () => {
  const locale = await getLocale();
  const categories = await getAllCategories();
  const { currentLanguage } = getLanguage(locale as Locale);

  return (
    <form action={appRoutes.SEARCH} method="GET">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Select name="category">
          <SelectTrigger className="w-45">
            <SelectValue placeholder={currentLanguage.Header.search.allLabel} />
          </SelectTrigger>

          <SelectContent>
            <SelectItem key="All" value="All">
              {currentLanguage.Header.search.allLabel}
            </SelectItem>

            {categories.map((c) => (
              <SelectItem key={c.category} value={c.category}>
                {c.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          name="query"
          type="text"
          placeholder={currentLanguage.Header.search.searchInputPlaceholder}
          className="md:w-25 lg:w-75"
        />

        <Button type="submit">
          <SearchIcon />
        </Button>
      </div>
    </form>
  );
};

export default Search;
