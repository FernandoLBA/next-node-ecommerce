import { getLocale } from "next-intl/server";

import { getBestFiveCategories } from "@/lib/actions/category.actions";
import { appRoutes } from "@/lib/constants";
import { getLanguage } from "@/lib/utils";
import { Category, Locale } from "@/types";
import { AppLink } from "./shared/app-link/app-link";
import AppImage from "./ui/app-image";
import { Card, CardContent, CardDescription } from "./ui/card";

const TopCategories = async () => {
  const locale = await getLocale();
  const categories = await getBestFiveCategories();
  const { currentLanguage } = getLanguage(locale as Locale);
  const featuredCategories: Category[] = categories.slice(0, 4);
  const bannerCategory: Category | undefined = categories.pop();

  return (
    <div className="bg-primary p-4 rounded-md my-8">
      <h1 className="h2-bold mb-4 mt-8 text-primary-foreground">
        {currentLanguage.HomePage.TopCategories.title}
      </h1>

      <div className="flex justify-center flex-wrap md:flex-nowrap gap-4 mb-4">
        {featuredCategories.map((c) => (
          <Card className="p-0 w-full md:w-auto md:flex-1 min-w-0" key={c.id}>
            <CardContent className="p-0 m-0">
              <div className="relative">
                <AppLink
                  className="block"
                  href={`${appRoutes.SEARCH}?category=${c.name}`}
                >
                  <AppImage
                    fill
                    className="brightness-80"
                    containerClassName="h-70 hover:opacity-80"
                    alt={c.name}
                    src={c.image}
                  />

                  <CardDescription className="absolute bottom-0 left-0 px-2 py-1 font-medium text-white text-md">
                    {c.name}
                  </CardDescription>
                </AppLink>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative max-w-[1920px] h-48 md:h-72 lg:h-100 rounded-md overflow-hidden bg-linear-to-t from-black/80 to-transparent">
        <AppLink
          className="block h-full"
          href={`${appRoutes.SEARCH}?category=${bannerCategory?.name}`}
        >
          <AppImage
            className="brightness-80"
            containerClassName="h-full hover:opacity-80"
            fill
            src={bannerCategory?.image || `${appRoutes.IMAGES}/promo.jpg`}
            alt={bannerCategory?.name ?? ""}
            sizes="100vw"
          />
        </AppLink>

        <h2 className="absolute bottom-0 left-0 px-2 md:px-4 py-1 md:py-3 font-medium text-white text-lg">
          {bannerCategory?.name}
        </h2>
      </div>
    </div>
  );
};

export default TopCategories;
