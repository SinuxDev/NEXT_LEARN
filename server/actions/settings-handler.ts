"use server";

import { UserSettingsSchema } from "@/types/types";
import { createSafeActionClient } from "next-safe-action";
import { auth } from "../auth";
import { db } from "@/server/index";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const settingsHandler = action
  .schema(UserSettingsSchema)
  .action(async ({ parsedInput }) => {
    const user = await auth();

    if (!user) {
      return { error: "User not found" };
    }

    const dbUserDoc = await db.query.users.findFirst({
      where: eq(users.id, user.user.id),
    });

    if (!dbUserDoc) {
      return { error: "User not found" };
    }

    // Handle OAuth Usesrs Settings :  Skip fields that are not allowed to be updated
    if (user.user.isOAuth) {
      parsedInput = {
        ...parsedInput,
        email: undefined,
        password: undefined,
        newPassword: undefined,
        isTwoFactorEnabled: undefined,
      };
    }

    if (
      !user.user.isOAuth &&
      parsedInput.password &&
      parsedInput.newPassword &&
      dbUserDoc.password
    ) {
      const isCurrentPasswordCorrect = await bcrypt.compare(
        parsedInput.password,
        dbUserDoc.password
      );

      if (!isCurrentPasswordCorrect) {
        return { error: "Incorrect current password" };
      }

      const isSameAsOldPassword = await bcrypt.compare(
        parsedInput.newPassword,
        dbUserDoc.password
      );

      if (isSameAsOldPassword) {
        return {
          error: "New password must be different from the current password",
        };
      }

      const hashedPassword = await bcrypt.hash(parsedInput.newPassword, 10);
      parsedInput.password = hashedPassword;
      parsedInput.newPassword = undefined;
    }

    await db
      .update(users)
      .set({
        password: parsedInput.password,
        twoFactorEnabled: parsedInput.isTwoFactorEnabled,
        email: parsedInput.email,
        name: parsedInput.name,
        image: parsedInput.image,
      })
      .where(eq(users.id, user.user.id));

    revalidatePath("/dashboard/settings");
    return { success: "Settings Updated" };
  });
