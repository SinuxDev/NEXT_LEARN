"use client";

import { ProductSchema } from "@/types/types";
import { useForm } from "react-hook-form";
import z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { createProducts } from "@/server/dashboard/create-products";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Tiptap from "@/components/dashboard/tiptap";
import { getProduct } from "@/server/dashboard/get-products";
import { useEffect } from "react";

export default function ProductForm({ val }: { val: string }) {
  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
    mode: "onChange",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const editMode = searchParams.get("id");

  const checkProductExists = async (id: number) => {
    if (editMode) {
      const { error, productDoc } = await getProduct(id);

      if (error) {
        toast.error(error);
        router.push("/dashboard/products");
        return;
      }

      if (productDoc) {
        form.setValue("title", productDoc.title);
        form.setValue("description", productDoc.description);
        form.setValue("price", productDoc.price);
        form.setValue("id", productDoc.id);
      }
    }
  };

  useEffect(() => {
    if (editMode) {
      checkProductExists(Number(editMode));
    }
  }, [editMode]);

  const { execute, status } = useAction(createProducts, {
    onSuccess(data) {
      if (data.data?.error) {
        toast.error(data.data.error);
      }

      if (data.data?.success) {
        router.push("/dashboard/products");
        toast.success(data.data.success);
      }
    },
    onExecute() {
      if (editMode) {
        toast.loading("Updating product");
      }

      if (!editMode) {
        toast.loading("Creating product");
      }
    },
    onError() {
      toast.error("An error occurred");
    },
  });

  async function onSubmit(values: z.infer<typeof ProductSchema>) {
    execute(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {" "}
          {editMode ? "Update Your Product" : "Add Your Product"}{" "}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input placeholder="SxHnin Stta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Tiptap val={field.value} />
                  </FormControl>
                  <FormDescription>
                    Write your products description
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <DollarSign
                        size={37}
                        className="p-2 bg-muted rounded-md"
                      />
                      <Input
                        {...field}
                        type="number"
                        placeholder="Your price in USD"
                        step={0.1}
                        min={0}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={
                status === "executing" ||
                !form.formState.isValid ||
                !form.formState.isDirty
              }
              type="submit"
            >
              {editMode ? "Update Product" : "Create Product"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
