"use server";
import { createSafeActionClient } from "next-safe-action";
import { products } from "../schema";
import { ProductSchema } from "@/types/types";
import { db } from "..";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const createProducts = action
  .schema(ProductSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { id, description, title, price } = parsedInput;

      if (id) {
        const currentProducts = await db.query.products.findFirst({
          where: eq(products.id, id),
        });

        if (!currentProducts) {
          return { error: "Product not found" };
        }

        const updateProduct = await db
          .update(products)
          .set({
            description,
            title,
            price,
          })
          .where(eq(products.id, id))
          .returning();

        revalidatePath("/dashboard/products");

        return {
          success: `Product ${updateProduct[0].title} has been updated`,
        };
      }

      const newProduct = await db
        .insert(products)
        .values({
          description,
          title,
          price,
        })
        .returning();
      revalidatePath("/dashboard/products");

      return { success: `Product ${newProduct[0].title} has been created` };
    } catch (err) {
      return { error: "Error creating post" };
    }
  });
