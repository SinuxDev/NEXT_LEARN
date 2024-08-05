import { cookies } from "next/headers";

export default async function Home() {
  cookies();
  return (
    <main>
      <div>{Date.now()}</div>
    </main>
  );
}
