"use server";

import { VariantSchema } from "@/types/types";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import {
  products,
  productVariants,
  VariantsImages,
  VariantsTags,
} from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import algoliasearch from "algoliasearch";

const action = createSafeActionClient();

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_ADMIN!
);

const algoliaIndex = client.initIndex("products");

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

        algoliaIndex.partialUpdateObject({
          objectID: editVariant[0].id.toString(),
          id: editVariant[0].productID,
          productType: editVariant[0].productType,
          VariantsImages: newImgs[0].url,
        });

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

        const product = await db.query.products.findFirst({
          where: eq(products.id, productID),
        });

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

        if (product) {
          algoliaIndex.saveObject({
            objectID: newVariant[0].id.toString(),
            id: newVariant[0].productID,
            title: product.title,
            price: product.price,
            productType: newVariant[0].productType,
            VariantsImages: newImgs[0].url,
          });
        }

        revalidatePath("/dashboard/products");
        return { success: "Variant created" };
      }
    } catch (error) {
      return { error: "Error creating variant" };
    }
  });
