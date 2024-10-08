"use server";

import { ReviewSchema } from "@/types/types";
import { createSafeActionClient } from "next-safe-action";
import { auth } from "../auth";
import { db } from "..";
import { and, eq } from "drizzle-orm";
import { reviews } from "../schema";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const addReview = action
  .schema(ReviewSchema)
  .action(async ({ parsedInput }) => {
    const { productID, rating, comment } = parsedInput;

    try {
      const session = await auth();
      if (!session) return { error: "You must be logged in to add a review" };

      const reviewExists = await db.query.reviews.findFirst({
        where: and(
          eq(reviews.productID, productID),
          eq(reviews.userID, session.user.id)
        ),
      });

      if (reviewExists) {
        return { error: "You have already reviewed this product" };
      }

      const newReviews = await db
        .insert(reviews)
        .values({
          productID,
          rating,
          comment,
          userID: session.user.id,
        })
        .returning();

      revalidatePath(`/products/${productID}`);

      return { success: newReviews[0] };
    } catch (err) {
      return { error: JSON.stringify(err) };
    }
  });
