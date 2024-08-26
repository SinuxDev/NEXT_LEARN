"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { VariantsWithImagesTags } from "@/types/infer-types";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type ProductShowcaseProps = {
  variants: VariantsWithImagesTags[];
};

export default function ProductShowcase({ variants }: ProductShowcaseProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [activeThumbnail, setActiveThumbnail] = useState([0]);
  const searchParams = useSearchParams();
  const selectedColor = searchParams.get("type") || variants[0].productType;

  const updatePreview = (index: number) => {
    api?.scrollTo(index);
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("slidesInView", (e) => {
      setActiveThumbnail(e.slidesInView);
    });
  }, [api]);

  return (
    <Carousel setApi={setApi} opts={{ loop: true }}>
      <CarouselContent>
        {variants
          .filter((variant) => variant.productType === selectedColor)
          .flatMap((variant) =>
            variant.variantImages.map((image, index) => (
              <CarouselItem key={index}>
                {image.url ? (
                  <Image
                    src={image.url}
                    alt={image.name}
                    className="rounded-md"
                    width={1080}
                    height={600}
                    priority
                  />
                ) : null}
              </CarouselItem>
            ))
          )}
      </CarouselContent>
      <div className="flex overflow-clip py-2 gap-4">
        {variants
          .filter((variant) => variant.productType === selectedColor)
          .flatMap((variant) =>
            variant.variantImages.map((image, index) => (
              <div key={index}>
                {image.url ? (
                  <Image
                    onClick={() => updatePreview(index)}
                    src={image.url}
                    alt={image.name}
                    className={cn(
                      index === activeThumbnail[0]
                        ? "opacity-100"
                        : "opacity-50",
                      "rounded-md transition-all duration-300 ease-in-out cursor-pointer hover:opacity-75"
                    )}
                    width={48}
                    height={72}
                    priority
                  />
                ) : null}
              </div>
            ))
          )}
      </div>
    </Carousel>
  );
}
