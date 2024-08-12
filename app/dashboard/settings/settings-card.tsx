"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Session } from "next-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UserSettingsSchema } from "@/types/types";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { FormErrorMsg } from "@/components/auth/form-error";
import { FormSuccessMsg } from "@/components/auth/form-success";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { settingsHandler } from "@/server/actions/settings-handler";

type SettingsProps = {
  session: Session;
};

export default function SettingCard(session: SettingsProps) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [avatarUploading, setAvatarUploading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof UserSettingsSchema>>({
    resolver: zodResolver(UserSettingsSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      name: session.session.user?.name!,
      email: session.session.user?.email!,
      isTwoFactorEnabled: session.session.user?.isTwoFactorEnabled!,
      image: session.session.user.image ?? "",
    },
  });

  const { execute, status } = useAction(settingsHandler, {
    onError: () => {
      setError("Something went wrong. Please try again.");
    },
    onSuccess: (data) => {
      if (data.data?.success) {
        setSuccess(data.data.success);
      }

      if (data.data?.error) {
        setError(data.data.error);
      }
    },
  });

  const onSubmit = async (values: z.infer<typeof UserSettingsSchema>) => {
    execute(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Your Account Settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Shinn Thant Aye" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Image</FormLabel>
                  <div className="flex items-center gap-4">
                    {!form.getValues("image") && (
                      <div className="font-bold">
                        {session.session.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {form.getValues("image") && (
                      <Image
                        src={form.getValues("image")!}
                        width={42}
                        height={42}
                        className="rounded-full"
                        alt="User Image"
                      />
                    )}
                  </div>
                  <FormControl>
                    <Input
                      disabled={status === "executing"}
                      type="file"
                      {...field}
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
                      disabled={
                        status === "executing" ||
                        session.session.user?.isOAuth === true
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      {...field}
                      disabled={
                        status === "executing" ||
                        session.session.user?.isOAuth === true
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isTwoFactorEnabled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Authentication</FormLabel>
                  <FormDescription>
                    Enable Two Factor Authentication for your account
                  </FormDescription>
                  <FormControl>
                    <Switch
                      onCheckedChange={field.onChange}
                      checked={field.value}
                      disabled={
                        status === "executing" ||
                        session.session.user?.isOAuth === true
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormErrorMsg message={error} />
            <FormSuccessMsg message={success} />
            <Button type="submit" disabled={status === "executing"}>
              Update Your Settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
