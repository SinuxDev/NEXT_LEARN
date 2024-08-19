"use server";

import { VariantSchema } from "@/types/types";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { productVariants, VariantsImages, VariantsTags } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const createVariant = action
  .schema(VariantSchema)
  .action(async ({ parsedInput }) => {
    const {
      editMode,
      color,
      id,
      productID,
      productType,
      tags,
      variantImages: newImgs,
    } = parsedInput;

    try {
      if (editMode && id) {
        const editVariant = await db
          .update(productVariants)
          .set({
            color,
            productType,
            updated: new Date(),
          })
          .where(eq(productVariants.id, id))
          .returning();

        await db
          .delete(VariantsTags)
          .where(eq(VariantsTags.variantID, editVariant[0].id));

        await db.insert(VariantsTags).values(
          tags.map((tag) => ({
            variantID: editVariant[0].id,
            tag,
          }))
        );

        await db
          .delete(VariantsImages)
          .where(eq(VariantsImages.variantID, editVariant[0].id));

        await db.insert(VariantsImages).values(
          newImgs.map((img, index) => ({
            name: img.name,
            size: img.size,
            url: img.url,
            variantID: editVariant[0].id,
            order: index,
          }))
        );

        revalidatePath("/dashboard/products");
        return { success: "Variant updated" };
      }

      if (!editMode) {
        const newVariant = await db
          .insert(productVariants)
          .values({
            color,
            productType,
            productID,
          })
          .returning();

        await db.insert(VariantsTags).values(
          tags.map((tag) => ({
            variantID: newVariant[0].id,
            tag,
          }))
        );

        await db.insert(VariantsImages).values(
          newImgs.map((img, index) => ({
            name: img.name,
            size: img.size,
            url: img.url,
            variantID: newVariant[0].id,
            order: index,
          }))
        );

        revalidatePath("/dashboard/products");
        return { success: "Variant created" };
      }
    } catch (error) {
      return { error: "Error creating variant" };
    }
  });
