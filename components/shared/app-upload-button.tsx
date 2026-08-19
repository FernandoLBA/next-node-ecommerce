"use client";

import { useTranslations } from "next-intl";
import { ComponentProps } from "react";

import { UploadButton } from "@/lib/uploadthing";
import LoaderIcon from "../ui/loader-icon";
import { cn } from "@/lib/utils";

export type UploadThingProps = ComponentProps<typeof UploadButton>;

const AppUploadButton = (props: UploadThingProps) => {
  const t = useTranslations("AppUploadButton");

  return (
    <UploadButton
      {...props}
      className={cn("ut-button", props.className)}
      content={{
        button({ isUploading, uploadProgress }) {
          if (isUploading)
            return (
              <span className="ut-span flex items-center gap-4">
                <LoaderIcon />
                {uploadProgress}%
              </span>
            );

          return <span className="ut-span">{t("chooseFileButton")}</span>;
        },
        allowedContent() {
          return t("allowedFileSizeText");
        },
      }}
    />
  );
};

export default AppUploadButton;
