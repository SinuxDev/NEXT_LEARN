"use server";

import { db } from "@/server";

export default async function getPosts() {
  const posts = await db.query.posts.findMany();

  if (!posts) {
    return {
      status: 404,
      error: "Posts not found",
      isSuccess: false,
    };
  }

  return {
    status: 200,
    success: posts,
    isSuccess: true,
  };
}
