"use server";

import { RegisterSchema } from "@/types/types";
import { createSafeActionClient } from "next-safe-action";
import bcrypt from "bcrypt";
import { db } from "@/server/index";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { generateEmailVerificationToken } from "./tokens";
import { sendVerificationEmail } from "./send-email";

const actionClient = createSafeActionClient();

export const emailRegister = actionClient
  .schema(RegisterSchema)
  .action(async ({ parsedInput: { email, password, name } }) => {
    const hasedPassword = await bcrypt.hash(password, 10);
    console.log(hasedPassword);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken({
          email,
        });

        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );

        return { success: "Email verification sent" };
      }

      return { error: "User already exists" };
    }

    try {
      const newUser = await db
        .insert(users)
        .values({
          email,
          password: hasedPassword,
          name,
        })
        .returning();

      const verificationToken = await generateEmailVerificationToken({
        email,
      });

      await sendVerificationEmail(
        verificationToken[0].email,
        verificationToken[0].token
      );

      return {
        success: "User created successfully",
        data: newUser,
      };
    } catch (error) {
      return { error: "Error creating user" };
    }
  });
