import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { AppButtonProps } from "../app-button/app-button";

export interface AppLinkButtonProps {
  children: React.ReactNode;
  href: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  variant?: AppButtonProps["variant"];
  size?: AppButtonProps["size"];
  className?: string;
  "aria-label"?: string;
}

/**
 * Navigation link with the same look as a Button.
 * Renders a single localized <Link> (never a link inside a button) so the whole
 * area is clickable and the HTML stays valid.
 *
 * @param param0
 * @returns
 */
export const AppLinkButton: React.FC<AppLinkButtonProps> = ({
  children,
  href,
  target = "_self",
  variant = "default",
  size = "default",
  className,
  "aria-label": ariaLabel,
}) => {
  return (
    <Link
      href={href}
      target={target}
      aria-label={ariaLabel}
      className={cn(
        buttonVariants({ variant, size }),
        variant === "link" && "h-4.5 justify-start p-0",
        "no-underline!",
        className,
      )}
    >
      {children}
    </Link>
  );
};
