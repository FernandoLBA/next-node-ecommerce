import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export interface AppLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  target?: "_blank" | "_self" | "_parent" | "_top";
  isUnderlined?: boolean;
}

export const AppLink: React.FC<AppLinkProps> = ({
  href,
  className,
  children,
  target = "_self",
  isUnderlined = false,
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "capitalize text-sm dark:hover:text-primary!",
        isUnderlined && "underline",
        "transitions",
        className,
      )}
      target={target}
    >
      {children}
    </Link>
  );
};
