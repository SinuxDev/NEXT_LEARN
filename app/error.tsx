"use client";

export default function Error() {
  return (
    <main>
      <div>{Date.now()}</div>
      <h1 className="bg-red-600 text-white text-3xl">Error</h1>
      <h1>Something went wrong</h1>
    </main>
  );
}
