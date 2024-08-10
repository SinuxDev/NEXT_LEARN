import NextAuth, { CredentialsSignin } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/server";
import Google from "@auth/core/providers/google";
import GitHub from "@auth/core/providers/github";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/types/types";
import { eq } from "drizzle-orm";
import { users } from "./schema";
import bcrypt from "bcrypt";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  secret: process.env.AUTH_SECRET!,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
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
