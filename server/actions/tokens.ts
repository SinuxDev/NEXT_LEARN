"use server";

import { db } from "@/server/index";
import { arrayContains, eq } from "drizzle-orm";
import { email_verificationTokens } from "../schema";

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
