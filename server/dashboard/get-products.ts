"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import { products } from "../schema";

export async function getProduct(id: number) {
  try {
    const productDoc = await db.query.products.findFirst({
      where: eq(products.id, id),
    });

    if (!productDoc) {
      return { error: "Product not found" };
    }

    return {
      productDoc,
    };
  } catch (err) {
    return { error: "Error getting product" };
  }
}
