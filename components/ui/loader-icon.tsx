import { Loader } from "lucide-react";

import { cn } from "@/lib/utils";

export default function LoaderIcon({
  loaderColor,
  className,
}: {
  loaderColor?: string;
  className?: string;
}) {
  return (
    <Loader
      color={loaderColor}
      className={cn("w-6 h-6 animate-spin", className)}
    />
  );
}
