import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { cn } from "@/lib/utils";

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Sample Next.js App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
  profile,
}: Readonly<{
  children: React.ReactNode;
  profile: React.ReactNode;
}>) {
  const isAdmin: boolean = false;
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <nav>
          <ul className="flex justify-between px-4  bg-blue-600 text-white gap-2">
            <li>
              {" "}
              <Link href={"/"}>Home</Link>{" "}
            </li>
            <li>
              {" "}
              <Link href={"/about"}>About</Link>{" "}
            </li>
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}
