"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useCartStore } from "@/lib/client-store";
import orderConfirm from "@/public/Animation-json/AnimationOrderConfirmation.json";
import Lottie from "lottie-react";
import { motion } from "framer-motion";

export default function OrderConfirm() {
  const { setCheckoutProgress, setCartOpen } = useCartStore();
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Lottie className="h-56 my-4" animationData={orderConfirm} />
      </motion.div>

      <h2 className="text-xl font-medium">Thank you for your Purchase</h2>

      <Link href={"/dashboard/orders"}>
        <Button
          variant={"secondary"}
          onClick={() => {
            setCheckoutProgress("cart-page");
            setCartOpen(false);
          }}
        >
          View your order
        </Button>
      </Link>
    </div>
  );
}
