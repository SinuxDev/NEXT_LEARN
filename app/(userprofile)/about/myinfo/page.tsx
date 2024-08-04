import Link from "next/link";

export default function myInfo() {
  return (
    <div>
      <h1>My Info</h1>
      <h2>This is my Info Page</h2>
      <Link href={"/about"}>Go Back to About</Link>
      <Link href={"/"}>Go Back Home</Link>
    </div>
  );
}
