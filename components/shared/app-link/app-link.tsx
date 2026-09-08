import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export interface AppLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  target?: "_blank" | "_self" | "_parent" | "_top";
  isSelected?: boolean;
  isUnderlined?: boolean;
}

export const AppLink: React.FC<AppLinkProps> = ({
  href,
  className,
  children,
  target = "_self",
  isSelected = false,
  isUnderlined = false,
}) => {
  const commonClasses = cn(
    "capitalize font-medium text-sm",
    isSelected
      ? "font-bold cursor-default text-accent-foreground!"
      : "text-muted-foreground",
    isUnderlined && "underline",
    "transition-colors",
  );

  return (
    <Link href={href} className={cn(commonClasses, className)} target={target}>
      {children}
    </Link>
  );
};
