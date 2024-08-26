"use client";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

type ProductPickProps = {
  id: number;
  color: string;
  productType: string;
  title: string;
  price: number;
  productID: number;
  image: string;
};

export default function ProductPick({
  id,
  color,
  productType,
  title,
  price,
  productID,
  image,
}: ProductPickProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedColor =
    searchParams.get(productType) || searchParams.get("type");

  return (
    <div
      style={{ backgroundColor: color }}
      className={cn(
        "w-8 h-8 rounded-full cursor-pointer transition-all duration-300 ease-in-out hover:opacity-75",
        selectedColor === productType ? "opacity-100" : "opacity-50"
      )}
      onClick={() =>
        router.push(
          `/products/${id}?id=${id}&productID=${productID}&price=${price}&title=${title}&type=${productType}&image=${image}`,
          { scroll: false }
        )
      }
    ></div>
  );
}
