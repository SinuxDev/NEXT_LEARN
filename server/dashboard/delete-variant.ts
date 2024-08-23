"use server";

import { db } from "..";
import * as z from "zod";
import { createSafeActionClient } from "next-safe-action";
import { productVariants } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

const schema = z.object({
  id: z.number(),
});

export const deleteProductVariant = action
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const { id } = parsedInput;

    try {
      const deleteVariant = await db
        .delete(productVariants)
        .where(eq(productVariants.id, id))
        .returning();

      if (!deleteVariant) {
        return { error: "Product variant not found" };
      }

      revalidatePath("/dashboard/products");
      return { success: `Product variant has been deleted` };
    } catch (err) {
      return { error: "Error deleting product variant" };
    }
  });
