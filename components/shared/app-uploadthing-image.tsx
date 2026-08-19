import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import AppImage from "../ui/app-image";
import { Button } from "../ui/button";

export type AppUploadthingImageProps = {
  imageUrl: string;
  className: string;
  width: number;
  height: number;
  isLoading?: boolean;
  action: () => void;
};

const AppUploadthingImage = (props: AppUploadthingImageProps) => {
  return (
    <div className="w-fit h-fit relative">
      <AppImage
        className={cn("rounded-sm", props.className)}
        width={props.width}
        height={props.height}
        src={props.imageUrl}
        alt="Product Image"
      />

      <Button
        className="absolute h-6 w-6 -top-3 -right-2.5 z-10"
        onClick={props.action}
        disabled={props.isLoading || false}
        size="xs"
        variant="destructive"
      >
        <X />
      </Button>
    </div>
  );
};

export default AppUploadthingImage;
