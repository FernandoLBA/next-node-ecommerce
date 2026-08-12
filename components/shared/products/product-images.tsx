"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

import AppImage from "@/components/ui/app-image";

const ProductImages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className="space-y-4">
      <AppImage
        className="max-h-125 w-auto object-cover object-center rounded-xl"
        src={images[current]}
        alt="product image"
        height={500}
        width={500}
      />

      <div className={cn("flex", images.length === 0 && "hidden")}>
        {images.map((image, index) => (
          <div
            key={image}
            onClick={() => setCurrent(index)}
            className={cn(
              "border-2 border-gray-200 mr-2 hover:border-yellow-400 cursor-pointer rounded-xl overflow-hidden",
              current === index && "border-secondary",
            )}
          >
            <AppImage
              className="max-h-16 w-auto object-cover object-center"
              src={image}
              alt="product image"
              height={50}
              width={50}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
