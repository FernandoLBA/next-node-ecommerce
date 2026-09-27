import { CreditCard, HandCoins, Headset, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { getAppSettings } from "@/lib/actions/app-setting.actions";
import { getBestFiveCategories } from "@/lib/actions/category.actions";
import { appRoutes } from "@/lib/constants";
import { AppLink } from "./shared/app-link/app-link";
import LanguageToggle from "./shared/header/language-toggle";
import ModeToggle from "./shared/header/mode-toggle";
import AppImage from "./ui/app-image";

const linkClasses = "text-muted-foreground hover:text-primary normal-case";

const Footer = async () => {
  const t = await getTranslations("Footer");
  const tPayment = await getTranslations("PaymentMethod");
  const tSupport = await getTranslations("IconBoxes");
  const settings = await getAppSettings();
  const categories = await getBestFiveCategories();
  const currentYear = new Date().getFullYear();

  const exploreLinks = [
    { label: t("home"), href: appRoutes.HOME },
    { label: t("products"), href: appRoutes.SEARCH },
    { label: t("cart"), href: appRoutes.CART },
    { label: t("myOrders"), href: appRoutes.USER_ORDERS },
    { label: t("myProfile"), href: appRoutes.USER_PROFILE },
  ];

  const paymentMethods = [
    { label: "PayPal", icon: CreditCard },
    { label: "Stripe", icon: CreditCard },
    { label: tPayment("cashOnDelivery"), icon: HandCoins },
  ];

  return (
    <footer className="border-t bg-secondary text-primary">
      <div className="wrapper grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* //* BRAND */}
        <div className="space-y-3">
          <AppLink href={appRoutes.HOME} className="flex items-center gap-2">
            <AppImage
              src={`${appRoutes.IMAGES}/logo.svg`}
              alt={`${settings.appName} logo`}
              height={40}
              width={40}
            />

            <span className="text-2xl font-bold">{settings.appName}</span>
          </AppLink>
        </div>

        {/* //* NAVIGATION */}
        <nav aria-label={t("explore")} className="space-y-3">
          <h3 className="font-semibold">{t("explore")}</h3>

          <ul className="space-y-2 text-sm">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <AppLink href={link.href} className={linkClasses}>
                  {link.label}
                </AppLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* //* CATEGORIES */}
        {categories.length > 0 && (
          <nav aria-label={t("categories")} className="space-y-3">
            <h3 className="font-semibold">{t("categories")}</h3>

            <ul className="space-y-2 text-sm">
              {categories.map((category) => (
                <li key={category.id}>
                  <AppLink
                    href={`${appRoutes.SEARCH}?category=${encodeURIComponent(category.name)}`}
                    className={linkClasses}
                  >
                    {category.name}
                  </AppLink>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* //* PAYMENTS AND SUPPORT */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold">{t("weAccept")}</h3>

            <ul className="space-y-2 text-sm text-muted-foreground">
              {paymentMethods.map(({ label, icon: Icon }) => (
                <li key={label} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" aria-hidden />

                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Headset className="h-4 w-4" aria-hidden />

              {tSupport("support.title")}
            </p>

            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" aria-hidden />

              {t("securePayments")}
            </p>
          </div>
        </div>
      </div>

      {/* //* BOTTOM BAR */}
      <div className="border-t">
        <div className="wrapper flex flex-col items-center justify-between gap-2 py-4 text-sm sm:flex-row">
          <p>
            &copy; {currentYear} {settings.appName} {t("rights")}
          </p>

          <div className="flex items-center">
            <LanguageToggle />

            <ModeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
