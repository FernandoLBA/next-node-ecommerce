import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  size?:
    | "default"
    | "xs"
    | "sm"
    | "lg"
    | "icon"
    | "icon-xs"
    | "icon-sm"
    | "icon-lg"
    | null
    | undefined;
  variant?:
    "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export const AppButton: React.FC<AppButtonProps> = ({
  children,
  type = "button",
  variant = "default",
  size = "default",
  ...props
}) => {
  return (
    <Button
      className={cn(props.className)}
      type={type}
      variant={variant}
      size={size}
      {...props}
    >
      {children}
    </Button>
  );
};
