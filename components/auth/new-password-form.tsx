"use client";

import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { ForgetCard } from "./forget-card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NewPasswordSchema } from "@/types/types";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { NewPassword } from "@/server/actions/new-password";
import { useCallback, useEffect, useState } from "react";
import { FormSuccessMsg } from "./form-success";
import { FormErrorMsg } from "./form-error";
import { useRouter, useSearchParams } from "next/navigation";
import { newPasswordVerification } from "@/server/actions/tokens";

export default function NewPasswordForm() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const token = useSearchParams().get("token");

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const { status, execute } = useAction(NewPassword, {
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

  const validateToken = useCallback(async (token: string) => {
    const isValid = await newPasswordVerification(token);
    if (isValid.error) {
      setError(isValid.error);
      setTokenValid(false);
      return;
    }
    setTokenValid(true);
    setSuccess(isValid.success);
  }, []);

  useEffect(() => {
    if (token) {
      validateToken(token as string);
    }
  }, [token, validateToken]);

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    if (status === "executing") {
      return;
    }

    if (!tokenValid) {
      setError("Invalid token");
      return;
    }

    execute({
      password: values.password,
      token: token,
    });
  };

  return (
    <ForgetCard
      cardTitle="Enter your new password"
      backButtonHref="/auth/login"
      backButtonLabel="Go back to Login"
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {error && !success ? (
              <p className="text-red-500 text-center font-bold">{error}</p>
            ) : (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="*******"
                        {...field}
                        type="password"
                        autoComplete="new-password"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            <FormSuccessMsg message={success} />

            <FormErrorMsg message={error} />
            <Button
              className={cn(
                "w-full my-2 text-base",
                status === "executing" ? "animate-pulse" : null
              )}
            >
              {"Change Password"}
            </Button>
          </form>
        </Form>
      </div>
    </ForgetCard>
  );
}
