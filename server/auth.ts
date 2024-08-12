import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/server";
import Google from "@auth/core/providers/google";
import GitHub from "@auth/core/providers/github";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/types/types";
import { eq } from "drizzle-orm";
import { accounts, users } from "./schema";
import bcrypt from "bcrypt";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  secret: process.env.AUTH_SECRET!,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub ?? session.user.id;
        session.user.role = (token.role as string) ?? session.user.role;

        session.user.isTwoFactorEnabled =
          (token.isTwoFactorEnabled as boolean) ??
          session.user.isTwoFactorEnabled;

        session.user.name = token.name ?? session.user.name;
        session.user.email = (token.email as string) ?? session.user.email;

        session.user.isOAuth =
          (token.isOAuth as boolean) ?? session.user.isOAuth;

        session.user.image = (token.image as string) ?? session.user.image;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }

      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, token.sub),
      });

      if (!existingUser) {
        return token;
      }

      const existingAccount = await db.query.accounts.findFirst({
        where: eq(accounts.userId, existingUser.id),
      });

      token.isOAuth = Boolean(existingAccount);
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.twoFactorEnabled;
      token.image = existingUser.image;

      return token;
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      async authorize(credentials) {
        const validateFields = LoginSchema.safeParse(credentials);

        if (validateFields.success) {
          const { email, password } = validateFields.data;

          const userDoc = await db.query.users.findFirst({
            where: eq(users.email, email),
          });

          if (!userDoc || !userDoc.password) {
            return null;
          }

          const isPasswordMatch = await bcrypt.compare(
            password,
            userDoc.password
          );

          if (isPasswordMatch) {
            return userDoc;
          }
        }

        return null;
      },
    }),
  ],
});
