import { Loader } from "lucide-react";

import { cn, getCssVariableValue } from "@/lib/utils";

export default function LoaderIcon({
  loaderColor,
  className,
}: {
  loaderColor?: string;
  className?: string;
}) {
  const defaultLoaderColor = getCssVariableValue("--background");

  return (
    <Loader
      color={loaderColor || defaultLoaderColor}
      className={cn("w-6 h-6 animate-spin text-primary", className)}
    />
  );
}
