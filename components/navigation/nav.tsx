import { auth } from "@/server/auth";
import Logo from "@/components/navigation/logo";
import UserButton from "./user-button";
import { Button } from "../ui/button";
import Link from "next/link";
import { Mail } from "lucide-react";
import CartDrawer from "../carts/cart-drawer";

export default async function Nav() {
  const session = await auth();

  return (
    <header className="border-gray-900/10 py-7 px-4 w-full">
      <nav>
        <ul
          className="flex justify-between items-center md:gap-8 gap-4"
          aria-label="ShiLaxe"
        >
          <li className="flex flex-1">
            <Link href={"/"}>
              <Logo />
            </Link>
          </li>

          <li className="relative flex items-center hover:bg-muted cursor-pointer">
            <CartDrawer />
          </li>

          {session ? (
            <li className="flex items-center justify-center">
              <UserButton expires={session?.expires} user={session?.user} />
            </li>
          ) : (
            <li className="flex items-center justify-center">
              <Button asChild variant={"secondary"}>
                <Link href="/auth/login">
                  <Mail className="mr-2 h-4 w-4" /> Login
                </Link>
              </Button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
