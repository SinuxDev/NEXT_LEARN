"use server";

import { db } from "@/server/index";
import { arrayContains, eq } from "drizzle-orm";
import {
  email_verificationTokens,
  NewPasswordToken,
  TwoFactorTokens,
  users,
} from "../schema";
import crypto from "crypto";

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

export const getPasswordResetTokens = async ({ email }: { email: string }) => {
  try {
    const ResetTokenFromDB = await db.query.NewPasswordToken.findFirst({
      where: eq(NewPasswordToken.email, email),
    });

    if (!ResetTokenFromDB) {
      return null;
    }

    return ResetTokenFromDB;
  } catch (error) {
    return null;
  }
};

export const generatePasswordResetToken = async ({
  email,
}: {
  email: string;
}) => {
  const NewToken = crypto.randomUUID();
  const expiresToken = new Date(new Date().getTime() + 1000 * 3600);

  const existingToken = await getPasswordResetTokens({ email });

  if (existingToken) {
    await db
      .delete(NewPasswordToken)
      .where(eq(NewPasswordToken.email, existingToken.email));
  }

  const newPasswordToken = await db
    .insert(NewPasswordToken)
    .values({
      token: NewToken,
      expires: expiresToken,
      email,
    })
    .returning();

  return newPasswordToken;
};

export const newPasswordVerification = async (token: string) => {
  const checkTokenExists = await db.query.NewPasswordToken.findFirst({
    where: eq(NewPasswordToken.token, token),
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

  return { success: "Token is valid" };
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await db.query.TwoFactorTokens.findFirst({
      where: eq(TwoFactorTokens.email, email),
    });

    if (!twoFactorToken) {
      return null;
    }

    return twoFactorToken;
  } catch (error) {
    return null;
  }
};

export const getTwoFactorTokenByToken = async ({
  token,
}: {
  token: string;
}) => {
  try {
    const twoFactorToken = await db.query.TwoFactorTokens.findFirst({
      where: eq(TwoFactorTokens.token, token),
    });

    if (!twoFactorToken) {
      return null;
    }

    return twoFactorToken;
  } catch (error) {
    return null;
  }
};

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100000, 999999).toString();
  const expiresToken = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getTwoFactorTokenByEmail(email);
  if (existingToken) {
    await db
      .delete(TwoFactorTokens)
      .where(eq(TwoFactorTokens.identifier, existingToken.identifier));
  }

  const TwoFactor = await db
    .insert(TwoFactorTokens)
    .values({
      token,
      expires: expiresToken,
      email,
    })
    .returning();

  return TwoFactor;
};
