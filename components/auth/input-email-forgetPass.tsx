"use client";

import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { ForgetCard } from "./forget-card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PasswordForgetEmailSchema } from "@/types/types";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { CheckUserEmail } from "@/server/actions/new-password";
import { useState } from "react";
import { FormSuccessMsg } from "./form-success";
import { FormErrorMsg } from "./form-error";

export default function InputEmailForgetPass() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof PasswordForgetEmailSchema>>({
    resolver: zodResolver(PasswordForgetEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const { status, execute } = useAction(CheckUserEmail, {
    onSuccess(data) {
      if (data.data?.error) {
        setError(data.data.error);
        return;
      }

      if (data.data?.success) {
        setSuccess(data.data.success);
        return;
      }
    },
  });

  const onSubmit = (values: z.infer<typeof PasswordForgetEmailSchema>) => {
    execute(values);
  };

  return (
    <ForgetCard
      cardTitle="Enter your email address"
      backButtonHref="/auth/login"
      backButtonLabel="Go back to Login"
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@email.com"
                      {...field}
                      autoComplete="email"
                      type="email"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormSuccessMsg message={success} />

            <FormErrorMsg message={error} />
            <Button
              className={cn(
                "w-full my-2 text-base",
                status === "executing" ? "animate-pulse" : null
              )}
            >
              {"Send Email"}
            </Button>
          </form>
        </Form>
      </div>
    </ForgetCard>
  );
}
