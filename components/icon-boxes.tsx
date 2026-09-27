import { getTranslations } from "next-intl/server";
import { DollarSign, Headset, ShoppingBag, WalletCards } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const IconBoxes = async () => {
  const t = await getTranslations("IconBoxes");

  return (
    <div>
      <Card>
        <CardContent className="grid md:grid-cols-4 gap-4 p-4 text-muted-foreground">
          <div className="space-y-2">
            <ShoppingBag />

            <div className="text-sm font-bold">{t("freeShipping.title")}</div>

            <div className="text-sm">{t("freeShipping.description")}</div>
          </div>

          <div className="space-y-2">
            <DollarSign />

            <div className="text-sm font-bold">{t("returns.title")}</div>

            <div className="text-sm">{t("returns.description")}</div>
          </div>

          <div className="space-y-2">
            <WalletCards />

            <div className="text-sm font-bold">{t("payments.title")}</div>

            <div className="text-sm">{t("payments.description")}</div>
          </div>

          <div className="space-y-2">
            <Headset />

            <div className="text-sm font-bold">{t("support.title")}</div>

            <div className="text-sm">{t("support.description")}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IconBoxes;
