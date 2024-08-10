"use server";

import { createSafeActionClient } from "next-safe-action";
import { NewPasswordSchema, PasswordForgetEmailSchema } from "@/types/types";
import { generatePasswordResetToken } from "./tokens";
import { db } from "..";
import { eq } from "drizzle-orm";
import { NewPasswordToken, users } from "../schema";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "./send-email";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

const action = createSafeActionClient();
const checkEmail = createSafeActionClient();

export const NewPassword = action
  .schema(NewPasswordSchema)
  .action(async ({ parsedInput: { password, token } }) => {
    const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
    const dbPool = drizzle(pool);
    if (!token) {
      return { error: "Invalid token" };
    }

    const existingTokens = await db.query.NewPasswordToken.findFirst({
      where: eq(NewPasswordToken.token, token),
    });

    if (!existingTokens) {
      return { error: "Token not found" };
    }

    const hasExpired = new Date(existingTokens.expires) < new Date();

    if (hasExpired) {
      return { error: "Token has expired" };
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, existingTokens.email),
    });

    if (!existingUser) {
      return { error: "User not found" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await dbPool.transaction(async (sx) => {
      await sx
        .update(users)
        .set({
          password: hashedPassword,
        })
        .where(eq(users.email, existingTokens.email));

      await sx
        .delete(NewPasswordToken)
        .where(eq(NewPasswordToken.token, existingTokens.token));
    });

    return { success: "Password updated" };
  });

export const CheckUserEmail = checkEmail
  .schema(PasswordForgetEmailSchema)
  .action(async ({ parsedInput: { email } }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser) {
      return { error: "User not found" };
    }

    const token = await generatePasswordResetToken({ email });

    await sendVerificationEmail(email, token[0].token, true);

    return { success: "Email sent" };
  });
