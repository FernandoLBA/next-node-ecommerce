"use client";

import Autoplay from "embla-carousel-autoplay";

import AppImage from "@/components/ui/app-image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "@/i18n/routing";
import { appRoutes, CAROUSEL_DELAY } from "@/lib/constants";
import { Product } from "@/types";

const ProductCarousel = ({ data }: { data: Product[] }) => {
  const banners = data.filter((product) => product.banner);

  return (
    <Carousel
      className="w-full mb-12"
      opts={{ loop: true }}
      plugins={[
        Autoplay({
          delay: CAROUSEL_DELAY,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent>
        {banners.map((product) => (
          <CarouselItem key={product.id}>
            <Link href={`${appRoutes.PRODUCTS}/${product.slug}`}>
              <div className="relative mx-auto">
                <AppImage
                  className="w-full h-auto"
                  src={product.banner ?? ""}
                  alt="featured product"
                  width={1620}
                  height={480}
                />
                {/* 
                <div className="absolute inset-0 flex items-end justify-start">
                  <h2 className="bg-secondary text-2xl font-bold text-primary py-4 px-8">
                    {product.name}
                  </h2>
                </div> */}
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="hidden md:block">
        <CarouselPrevious />
      </div>

      <div className="hidden md:block">
        <CarouselNext />
      </div>
    </Carousel>
  );
};

export default ProductCarousel;
