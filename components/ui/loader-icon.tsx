import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

export default function LoaderIcon({ loaderColor, className }: { loaderColor?: string; className?: string }) {
  return (
    <Loader color={loaderColor} className={cn("w-6 h-6 animate-spin text-primary", className)} />
  );
}
