"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { AuthCard } from "./auth-card-";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/types/types";
import { Input } from "../ui/input";
import { z } from "zod";
import { Button } from "../ui/button";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { emailRegister } from "@/server/actions/email-register";
import { FormSuccessMsg } from "./form-success";
import { FormErrorMsg } from "./form-error";

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const { execute, status, isExecuting } = useAction(emailRegister, {
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

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    execute(values);
  };

  return (
    <AuthCard
      cardTitle="Register Your New Account"
      backButtonHref="/auth/login"
      backButtonLabel="Already have an account? Login"
      showSocials={false}
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mt-2">User Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Baby Shin" {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      type="email"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      {...field}
                      type="password"
                      autoComplete="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormSuccessMsg message={success} />
            <FormErrorMsg message={error} />
            <Button className={cn("w-full my-2 text-base")}>
              {"Reigster Now "}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};
