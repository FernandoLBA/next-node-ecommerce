import type { ImageProps } from "next/image";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

type BaseProps = Omit<ImageProps, "fill" | "style"> & {
  containerClassName?: string;
  quality?: number;
  sizes?: string;
  preload?: boolean;
  style?: CSSProperties;
};

type FillProps = BaseProps & {
  fill?: true;
  width?: never;
  height?: never;
};

type IntrinsicProps = BaseProps & {
  fill?: false;
  width: number;
  height: number;
  sizes?: never;
};

type AppImageProps = FillProps | IntrinsicProps;

export default function AppImage({
  containerClassName,
  quality = 85,
  preload = false,
  ...props
}: AppImageProps) {
  if (props.fill) {
    return (
      <div
        className={cn(
          "relative overflow-hidden w-full h-full",
          containerClassName,
        )}
      >
        <Image
          {...props}
          src={props.src}
          alt={props.alt}
          className={cn("object-cover", props.className)}
          style={props.style ?? { height: "auto" }}
          fill
          loading="eager"
          quality={quality}
          preload={preload}
          sizes={
            props.sizes ??
            "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          }
        />
      </div>
    );
  }

  return (
    <div className={cn("flex-center h-auto w-auto", containerClassName)}>
      <Image
        src={props.src}
        alt={props.alt}
        className={cn("object-cover", props.className)}
        loading="eager"
        width={props.width}
        height={props.height}
        quality={quality}
        preload={preload}
      />
    </div>
  );
}
