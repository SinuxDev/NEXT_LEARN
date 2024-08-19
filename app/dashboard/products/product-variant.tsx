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
import VariantImages from "./variant-images";
import { useAction } from "next-safe-action/hooks";
import { createVariant } from "@/server/dashboard/create-variant";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export const ProductVariant = ({
  editMode,
  productID,
  variant,
  children,
}: {
  editMode: boolean;
  productID: number;
  variant?: VariantsWithImagesTags;
  children: React.ReactNode;
}) => {
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

  const setEdit = () => {
    if (!editMode) {
      form.reset();
      return;
    }

    if (editMode && variant) {
      form.setValue("editMode", true);
      form.setValue("id", variant.id);
      form.setValue("productID", variant.productID);
      form.setValue("productType", variant.productType);
      form.setValue(
        "tags",
        variant.variantTags.map((tag) => tag.tag)
      );
      form.setValue(
        "variantImages",
        variant.variantImages.map((img) => ({
          name: img.name,
          size: img.size,
          url: img.url,
        }))
      );
      form.setValue("color", variant.color);
    }
  };

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setEdit();
  }, []);

  const { execute } = useAction(createVariant, {
    onExecute() {
      toast.loading("Creating variant...", { duration: 500 });
      setOpen(false);
    },
    onSuccess(data) {
      if (data.data?.success) {
        toast.success(data.data.success, { duration: 500 });
      }

      if (data.data?.error) {
        toast.error(data.data.error, { duration: 500 });
      }
    },
  });

  function onSubmit(values: z.infer<typeof VariantSchema>) {
    execute(values);
  }

  return (
    <Dialog modal={false} open={open} onOpenChange={setOpen}>
      <DialogTrigger> {children} </DialogTrigger>
      <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-[620px] rounded-md">
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
            <VariantImages />
            <div className="flex gap-4 items-center justify-center">
              {editMode && variant && (
                <Button
                  variant={"destructive"}
                  type="button"
                  onClick={(e) => e.preventDefault()}
                >
                  {" "}
                  Remove Variant{" "}
                </Button>
              )}
              <Button type="submit">
                {" "}
                {editMode ? "Update Variant" : "Create Variant"}{" "}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
