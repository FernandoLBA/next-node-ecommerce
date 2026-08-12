"use client";

import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

type StarIconProps = {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const StarIcon = ({ className, size = "md" }: StarIconProps) => {
  const starClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
    xl: "h-7 w-7",
  };

  return (
    <Star
      className={cn(
        "text-yellow-500 fill-yellow-500",
        className,
        size && starClasses[size],
      )}
    />
  );
};

export default StarIcon;
