"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { ReviewSchema } from "@/types/types";
import { Textarea } from "../ui/textarea";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReviewsForms() {
  const params = useSearchParams();
  const productId = Number(params.get("productId"));

  const form = useForm<z.infer<typeof ReviewSchema>>({
    resolver: zodResolver(ReviewSchema),
  });

  function onSubmit(values: z.infer<typeof ReviewSchema>) {
    console.log(values);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-full">
          <Button className="font-medium w-full" variant={"secondary"}>
            Write a review
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="comment">Comment</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="How would you describle this product?"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="rating">Leave Your Rating</FormLabel>
                  <FormControl>
                    <Input
                      type="hidden"
                      placeholder="Start Rating"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => {
                      return (
                        <motion.div
                          key={star}
                          className="relative cursor-pointer"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.8 }}
                        >
                          <Star
                            key={star}
                            onClick={() => {
                              form.setValue("rating", star);
                            }}
                            className={cn(
                              "text-primary bg-transparent transition-all duration-300 ease-in-out",
                              form.getValues("rating") >= star
                                ? "text-primary"
                                : "text-muted"
                            )}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Submit Review
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
