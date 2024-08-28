"use client";

import { useCartStore } from "@/lib/client-store";
import { ShoppingBagIcon } from "lucide-react";

export default function CartDrawer() {
  const { cart } = useCartStore();
  return (
    <div>
      <ShoppingBagIcon />
    </div>
  );
}
