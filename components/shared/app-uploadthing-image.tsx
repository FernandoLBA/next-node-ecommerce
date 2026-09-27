import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import AppImage from "../ui/app-image";
import { AppButton } from "./app-button/app-button";

export type AppUploadthingImageProps = {
  imageUrl: string;
  className: string;
  width: number;
  height: number;
  isLoading?: boolean;
  action: () => void;
};

const AppUploadthingImage = (props: AppUploadthingImageProps) => {
  const t = useTranslations("ProductImages");

  return (
    <div className="w-fit h-fit relative">
      <AppImage
        className={cn("rounded-sm", props.className)}
        width={props.width}
        height={props.height}
        src={props.imageUrl}
        alt={t("productImage")}
      />

      <AppButton
        className="absolute h-6 w-6 -top-3 -right-2.5 z-10"
        onClick={props.action}
        disabled={props.isLoading || false}
        size="xs"
        variant="destructive"
      >
        <X />
      </AppButton>
    </div>
  );
};

export default AppUploadthingImage;
