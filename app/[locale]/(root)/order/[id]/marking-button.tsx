import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import LoaderIcon from "@/components/ui/loader-icon";

type MarkingButtonProps = {
  isPending: boolean;
  action: () => Promise<void>;
  text: "paid" | "delivered";
};

const MarkingButton = ({
  isPending,
  action,
  text: markAs,
}: MarkingButtonProps) => {
  const t = useTranslations("OrderDetails");
  const tCommon = useTranslations("Common");
  const buttonText = markAs === "paid" ? t("markAsPaid") : t("markAsDelivered");

  return (
    <Button className="w-full" disabled={isPending} onClick={action}>
      {isPending && <LoaderIcon className="w-4 h-4" />}
      {isPending ? tCommon("processing") : buttonText}
    </Button>
  );
};

export default MarkingButton;
