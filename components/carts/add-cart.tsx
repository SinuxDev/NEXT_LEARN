"use client";

import { useCartStore } from "@/lib/client-store";
import { useState } from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export default function AddCart() {
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const params = useSearchParams();
  const id = Number(params.get("id"));
  const productID = Number(params.get("productID"));
  const title = params.get("title")!;
  const price = Number(params.get("price"));
  const image = params.get("image")!;
  const type = params.get("type");

  if (!id || !productID || !title || !price || !image || !type) {
    toast.error("Invalid product");
  }

  return (
    <>
      <div className="flex items-center gap-4 justify-stretch my-4">
        <Button
          onClick={() => {
            if (quantity > 1) {
              setQuantity(quantity - 1);
            }
          }}
          variant={"secondary"}
          className="text-primary"
        >
          <Minus size={18} strokeWidth={3} />
        </Button>

        <Button className="flex-1">Quantity : {quantity}</Button>

        <Button
          onClick={() => {
            setQuantity(quantity + 1);
          }}
          className="text-primary"
          variant={"secondary"}
        >
          <Plus size={18} strokeWidth={3} />
        </Button>
      </div>
      <Button
        onClick={() => {
          toast.success(`${title} added to cart`);
          addToCart({
            id: productID,
            variant: { variantID: id, quantity },
            name: title + type,
            price,
            image,
          });
        }}
      >
        Add To Cart
      </Button>
    </>
  );
}
