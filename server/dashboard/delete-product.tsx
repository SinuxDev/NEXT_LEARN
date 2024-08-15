"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { db } from "..";
import { products } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

const schema = z.object({
  id: z.number(),
});

export const deleteProduct = action
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const { id } = parsedInput;

    try {
      const data = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();

      if (!data) {
        {
          error: "Product not found";
        }
      }

      revalidatePath("/dashboard/products");
      return { success: `Products ${data[0].title} has been deleted` };
    } catch (err) {
      return { error: "Error deleting product" };
    }
  });
