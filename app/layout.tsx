import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Nav from "@/components/navigation/nav";
import { ThemeProvider } from "@/components/theme-provider";

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
  return (
    <html lang="en">
      <body
        className={cn(
          "px-6 md:px-24 max-w-7xl mx-auto font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Nav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
