"use client";

import { VariantsWithImagesTags } from "@/types/infer-types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { VariantSchema } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputTags } from "./input-tags";

export default function ProductVariant({
  editMode,
  productID,
  variant,
  children,
}: {
  editMode: boolean;
  productID: number;
  variant?: VariantsWithImagesTags;
  children: React.ReactNode;
}) {
  const form = useForm<z.infer<typeof VariantSchema>>({
    resolver: zodResolver(VariantSchema),
    defaultValues: {
      tags: [],
      variantImages: [],
      color: "#000000",
      editMode,
      id: undefined,
      productID,
      productType: "Black T-Shirt",
    },
    mode: "onChange",
  });

  function onSubmit(values: z.infer<typeof VariantSchema>) {
    console.log(values);
  }

  return (
    <Dialog modal={false}>
      <DialogTrigger> {children} </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {" "}
            {editMode ? "Edit" : "Create"} Your Variant{" "}
          </DialogTitle>
          <DialogDescription>
            Manage your product variants here. You can add tags, images, and
            more.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="productType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Type</FormLabel>
                  <FormControl>
                    <Input placeholder="SxHnin Stta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Colors</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Tags</FormLabel>
                  <FormControl>
                    <InputTags {...field} onChange={(e) => field.onChange(e)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* We will add images component here */}
            {editMode && variant && (
              <Button type="button" onClick={(e) => e.preventDefault()}>
                {" "}
                Remove Variant{" "}
              </Button>
            )}
            <Button type="submit">
              {" "}
              {editMode ? "Update Variant" : "Create Variant"}{" "}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
