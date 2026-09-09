import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { AppButton, AppButtonProps } from "../app-button/app-button";

export interface AppLinkButtonProps {
  children: React.ReactNode;
  href: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  variant?: AppButtonProps["variant"];
  className?: string;
}

/**
 *
 * @param param0
 * @returns
 */
export const AppLinkButton: React.FC<AppLinkButtonProps> = ({
  children,
  href,
  target = "_self",
  variant = "default",
  className,
}) => {
  return (
    <AppButton
      size="sm"
      variant={variant}
      className={cn(
        `${variant === "link" && " h-4.5 p-0"} no-underline!`,
        className,
      )}
    >
      <Link
        href={href}
        target={target}
        className={`${variant === "link" ? "flex-start" : "flex-center"} gap-2 w-full`}
      >
        {children}
      </Link>
    </AppButton>
  );
};
