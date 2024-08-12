"use server";

import { LoginSchema } from "@/types/types";
import { createSafeActionClient } from "next-safe-action";
import { db } from "@/server/index";
import { eq } from "drizzle-orm";
import { TwoFactorTokens, users } from "../schema";
import {
  generateEmailVerificationToken,
  generateTwoFactorToken,
  getTwoFactorTokenByEmail,
} from "./tokens";
import {
  sendTwoFactorVerificationEmail,
  sendVerificationEmail,
} from "./send-email";
import { signIn } from "../auth";
import { AuthError } from "next-auth";

const actionClient = createSafeActionClient();

export const emailSignIn = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser?.email !== email) {
        return { error: "User not found" };
      }

      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken({
          email: existingUser.email,
        });

        await sendVerificationEmail(
          existingUser.email,
          verificationToken[0].token
        );

        return { success: "Email verification sent" };
      }

      if (existingUser.twoFactorEnabled && existingUser.email) {
        if (code) {
          const twoFactorToken = await getTwoFactorTokenByEmail(
            existingUser.email
          );

          if (!twoFactorToken) {
            return { error: "Token not found" };
          }

          if (twoFactorToken.token !== code) {
            return { error: "Invalid token" };
          }

          const isTokenExpired = new Date(twoFactorToken.expires) < new Date();

          if (isTokenExpired) {
            return { error: "Token expired" };
          }

          await db
            .delete(TwoFactorTokens)
            .where(eq(TwoFactorTokens.identifier, twoFactorToken.identifier));
        } else {
          //Generate new token
          const GenerateTwoFactorToken = await generateTwoFactorToken(
            existingUser.email
          );

          if (!GenerateTwoFactorToken) {
            return { error: "Failed to generate two factor token" };
          }

          await sendTwoFactorVerificationEmail(
            GenerateTwoFactorToken[0].email,
            GenerateTwoFactorToken[0].token
          );

          return { twoFactor: "Two factor token sent" };
        }
      }

      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      });

      return { success: "Signed in!" };
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "AccessDenied":
            return { error: error.message };
          case "OAuthSignInError":
            return { error: error.message };
          case "CredentialsSignin":
            return { error: "Email or password incorrect" };
          default:
            return { error: "Something went wrong" };
        }
      }
      throw error;
    }
  });
