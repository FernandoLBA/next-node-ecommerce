import { getLocale } from "next-intl/server";

import { Link } from "@/i18n/routing";
import { getBestFiveCategories } from "@/lib/actions/category.actions";
import { appRoutes } from "@/lib/constants";
import { getLanguage } from "@/lib/utils";
import { Locale } from "@/types";
import AppImage from "./ui/app-image";
import { Card, CardContent, CardDescription } from "./ui/card";

const TopCategories = async () => {
  const locale = await getLocale();
  const categories = await getBestFiveCategories();
  const { currentLanguage } = getLanguage(locale as Locale);
  const featuredCategories = categories.slice(0, 4);
  const bannerCategory = categories.pop();

  return (
    <div className="bg-yellow-500 p-4 rounded-xl my-8">
      <h1 className="h2-bold mb-4 mt-8">
        {currentLanguage.HomePage.TopCategories.title}
      </h1>

      <div className="flex justify-center flex-wrap md:flex-nowrap gap-4 mb-4">
        {featuredCategories.map((c) => (
          <Card className="p-0" key={c.id}>
            <CardContent className="p-0 m-0">
              <div className="relative">
                <Link href={`${appRoutes.SEARCH}?category=${c.name}`}>
                  <AppImage
                    className="object-center brightness-90"
                    containerClassName="h-70 hover:opacity-80"
                    alt="category image"
                    src={c.image}
                    width={400}
                    height={200}
                  />

                  <CardDescription className="absolute bottom-0 left-0 px-2 py-1 font-semibold text-white text-lg">
                    {c.name}
                  </CardDescription>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative max-w-[1920px] max-h-100 rounded-xl overflow-hidden bg-linear-to-t from-black/80 to-transparent">
        <Link href={`${appRoutes.SEARCH}?category=${bannerCategory?.name}`}>
          <AppImage
            className="w-full"
            src={bannerCategory?.image || `${appRoutes.IMAGES}/promo.jpg`}
            alt="category image"
            width={500}
            height={400}
          />
        </Link>

        <h2 className="absolute bottom-0 left-0 px-2 md:px-4 py-1 md:py-3 font-semibold text-white text-lg md:text-xl">
          {bannerCategory?.name}
        </h2>
      </div>
    </div>
  );
};

export default TopCategories;
