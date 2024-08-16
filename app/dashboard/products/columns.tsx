"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircleIcon } from "lucide-react";
import { deleteProduct } from "@/server/dashboard/delete-product";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { VariantsWithImagesTags } from "@/types/infer-types";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ProductVariant from "./product-variant";

export type ProductColumn = {
  title: string;
  price: number;
  image: string;
  variants: VariantsWithImagesTags[];
  id: number;
};

const ActionCells = ({ row }: { row: Row<ProductColumn> }) => {
  const { execute } = useAction(deleteProduct, {
    onSuccess(data) {
      if (data.data?.success) {
        toast.success(data.data?.success);
      }

      if (data.data?.error) {
        toast.error(data.data?.error);
      }
    },
    onExecute() {
      toast.loading("Deleting product");
    },
  });

  const product = row.original;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem className="dark:focus:bg-primary focus:bg-primary/50 cursor-pointer">
          <Link href={`/dashboard/add-products?id=${product.id}`}>
            Edit Product
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => execute({ id: product.id })}
          className="dark:focus:bg-destructive focus:bg-destructive/50 cursor-pointer"
        >
          Delete Products
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "variants",
    header: "Variants",
    cell: ({ row }) => {
      const variants = row.getValue("variants") as VariantsWithImagesTags[];
      return (
        <div className="">
          {variants.map((variant) => (
            <div key={variant.id}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ProductVariant
                      productID={variant.productID}
                      variant={variant}
                      editMode={true}
                    >
                      <div
                        className="w-5 h-5 rounded-full"
                        key={variant.id}
                        style={{
                          backgroundColor: variant.color,
                        }}
                      ></div>
                    </ProductVariant>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p> {variant.productType} </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ProductVariant editMode={false} productID={row.original.id}>
                  <PlusCircleIcon className="h-4 w-4" />
                </ProductVariant>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add Variant</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
      return <div className="font-medium text-sm">{formatted}</div>;
    },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const cellImage = row.getValue("image") as string;
      const cellTitle = row.getValue("title") as string;
      return (
        <div className="">
          <Image
            src={cellImage}
            alt="Product"
            width={50}
            height={50}
            className="rounded-md"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ActionCells,
  },
];
