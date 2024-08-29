"use client";

import { useCartStore } from "@/lib/client-store";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
} from "../ui/table";
import { useMemo } from "react";
import { PriceFormatter } from "@/lib/price-formatter";
import Image from "next/image";
import { MinusCircle, PlusCircle } from "lucide-react";

export default function CartItems() {
  const { cart, addToCart, removeFromCart } = useCartStore();

  const totalPrice = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + item.price! * item.variant.quantity,
      0
    );
  }, [cart]);

  return (
    <div>
      {cart.length === 0 && (
        <div>
          <h1>Cart Is Empty</h1>
        </div>
      )}

      {cart.length > 0 && (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name} </TableCell>
                  <TableCell> {PriceFormatter(item.price)} </TableCell>
                  <TableCell>
                    <div>
                      <Image
                        className="rounded-md"
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between">
                      <MinusCircle
                        onClick={() => {
                          removeFromCart({
                            ...item,
                            variant: {
                              quantity: 1,
                              variantID: item.variant.variantID,
                            },
                          });
                        }}
                        size={14}
                        className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                      />

                      <p className="font-medium text-base">
                        {item.variant.quantity}
                      </p>

                      <PlusCircle
                        className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                        onClick={() => {
                          addToCart({
                            ...item,
                            variant: {
                              quantity: 1,
                              variantID: item.variant.variantID,
                            },
                          });
                        }}
                        size={14}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
