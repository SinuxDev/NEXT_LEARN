"use server";

import { db } from "@/server/index";
import { arrayContains, eq } from "drizzle-orm";
import { email_verificationTokens, users } from "../schema";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const tokenFromDB = await db
      .select({ token: email_verificationTokens.token })
      .from(email_verificationTokens)
      .where(arrayContains(email_verificationTokens.email, email));

    if (!tokenFromDB) {
      return null;
    }

    return tokenFromDB;
  } catch (error) {
    return error;
  }
};

export const generateEmailVerificationToken = async ({
  email,
}: {
  email: string;
}) => {
  const token = crypto.randomUUID();
  const expiresToken = new Date(new Date().getTime() + 1000 * 3600);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(email_verificationTokens)
      .where(eq(email_verificationTokens.email, email));
  }

  const verificationToken = await db
    .insert(email_verificationTokens)
    .values({
      email,
      token,
      expires: expiresToken,
    })
    .returning();

  return verificationToken;
};

export const newEmailVerification = async (token: string) => {
  const checkTokenExists = await db.query.email_verificationTokens.findFirst({
    where: eq(email_verificationTokens.token, token),
  });

  if (!checkTokenExists) {
    return { error: "Token not found" };
  }

  const expiresToken = new Date(checkTokenExists.expires) < new Date();

  if (expiresToken) {
    return { error: "Token expired" };
  }

  const exisitingUser = await db.query.users.findFirst({
    where: eq(users.email, checkTokenExists.email),
  });

  if (!exisitingUser) {
    return { error: "User not found! Email does not exists" };
  }

  await db
    .update(users)
    .set({
      emailVerified: new Date(),
    })
    .where(eq(users.email, checkTokenExists.email));

  await db
    .delete(email_verificationTokens)
    .where(eq(email_verificationTokens.email, checkTokenExists.email));

  return { success: "Email verified" };
};
