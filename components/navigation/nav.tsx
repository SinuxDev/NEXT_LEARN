import { auth } from "@/server/auth";
import Logo from "@/components/navigation/logo";
import UserButton from "./user-button";
import { Button } from "../ui/button";
import Link from "next/link";
import { Mail } from "lucide-react";

export default async function Nav() {
  const session = await auth();

  return (
    <header className="border-gray-900/10 py-7 px-4 w-full">
      <nav>
        <ul className="flex justify-between" aria-label="ShiLaxe">
          <li>
            <Link href={"/"}>
              <Logo />
            </Link>
          </li>
          <li>
            {session ? (
              <>
                <UserButton expires={session?.expires} user={session?.user} />
              </>
            ) : (
              <Button asChild variant={"secondary"}>
                <Link href="/auth/login">
                  <Mail className="mr-2 h-4 w-4" /> Login
                </Link>
              </Button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
