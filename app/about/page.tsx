import Link from "next/link";

export default function About() {
  return (
    <div>
      <h1>About</h1>
      <h2>This is my About Page</h2>
      <Link href={"/"}>Go Back Home</Link>
    </div>
  );
}
