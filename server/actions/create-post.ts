"use server";

import { db } from "@/server";
import { posts } from "../schema";
import { revalidatePath } from "next/cache";

export default async function createPost(formData: FormData) {
  const title = formData.get("title")?.toString();

  if (!title || title.trim() === "") {
    return {
      status: 400,
      error: "Title is required",
      isSuccess: false,
    };
  }

  revalidatePath("/");

  try {
    const insertPosts = await db
      .insert(posts)
      .values({
        title,
      })
      .execute();

    if (!insertPosts) {
      return {
        status: 500,
        error: "Failed to create post",
        isSuccess: false,
      };
    }

    return {
      status: 200,
      success: insertPosts,
      isSuccess: true,
    };
  } catch (error) {
    return {
      status: 500,
      error,
      isSuccess: false,
    };
  }
}
