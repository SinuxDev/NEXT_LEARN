// import { cookies } from "next/headers";

import PostButton from "@/component/post-button";
import createPost from "@/server/actions/create-post";
import getPosts from "@/server/actions/get-post";

export default async function Home() {
  // cookies();
  const { error, success } = await getPosts();

  if (error) {
    throw new Error(error);
  }

  return (
    <main>
      <div>{Date.now()}</div>
      <h1 className="bg-red-600 text-white text-3xl">Your Posts</h1>
      {success ? (
        success.map((post) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
          </div>
        ))
      ) : (
        <h1>Hello</h1>
      )}
      <form action={createPost} className="bg-green-600 p-2 mx-auto">
        <input
          type="text"
          name="title"
          className="bg-black"
          placeholder="title"
          required
        />
        <PostButton />
      </form>
    </main>
  );
}
