"use client";

import { VariantWithProducts } from "@/types/infer-types";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { PriceFormatter } from "@/lib/price-formatter";

type ProductProps = {
  variants: VariantWithProducts[];
};

export default function Products({ variants }: ProductProps) {
  return (
    <main className="grid sm:grid-cols-1 md:grid-cols-2 gap-12 lg:grid-cols-3">
      {variants.map((variant) => (
        <Link
          className="py-2"
          href={`/products/${variant.id}?id=${variant.id}&productID=${variant.productID}&price=${variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${variant.variantImages[0].url}`}
          key={variant.id}
        >
          <Image
            src={variant.variantImages[0].url}
            alt={variant.product.title}
            className="rounded-md pb-2"
            width={400}
            height={380}
            loading="lazy"
          />
          <div className="flex justify-between">
            <div className="font-medium">
              <h2> {variant.product.title} </h2>
              <p className="text-sm text-muted-foreground">
                {" "}
                {variant.productType}{" "}
              </p>
            </div>
            <div>
              <Badge className="text-sm" variant={"secondary"}>
                {PriceFormatter(variant.product.price)}
              </Badge>
            </div>
          </div>
        </Link>
      ))}
    </main>
  );
}
