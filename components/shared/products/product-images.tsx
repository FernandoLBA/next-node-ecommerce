"use client";

import AppImage from "@/components/ui/app-image";
import { cn } from "@/lib/utils";
import { useState } from "react";

const ProductImages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className="space-y-4">
      <AppImage
        className="min-h-75 object-cover object-center"
        src={images[current]}
        alt="product image"
        height={1000}
        width={1000}
      />

      <div className="flex">
        {images.map((image, index) => (
          <div
            key={image}
            onClick={() => setCurrent(index)}
            className={cn(
              "border border-gray-200 mr-2 hover:border-orange-600 cursor-pointer",
              current === index && "border-orange-500",
            )}
          >
            <AppImage src={image} alt="image" height={100} width={100} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
