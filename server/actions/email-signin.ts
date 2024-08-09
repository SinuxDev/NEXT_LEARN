"use server";

import { LoginSchema } from "@/types/types";
import { createSafeActionClient } from "next-safe-action";
import { db } from "@/server/index";
import { eq } from "drizzle-orm";
import { users } from "../schema";

const actionClient = createSafeActionClient();

export const emailSignIn = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser?.email !== email) {
      return { error: "User not found" };
    }

    if (!existingUser.emailVerified) {
      return { error: "Email not verified" };
    }

    console.log(email, password);
    return { success: email };
  });
