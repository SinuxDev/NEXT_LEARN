import { auth } from "@/server/auth";
import Logo from "@/components/navigation/logo";
import UserButton from "./user-button";
import { Button } from "../ui/button";
import Link from "next/link";
import { Mail } from "lucide-react";

export default async function Nav() {
  const session = await auth();

  return (
    <header className="bg-slate-500 py-4 px-4">
      <nav>
        <ul className="flex justify-between">
          <li>
            <Logo />
          </li>
          <li>
            {session ? (
              <>
                <UserButton expires={session?.expires} user={session?.user} />
              </>
            ) : (
              <Button asChild variant={"secondary"}>
                <Link href="/api/auth/signin">
                  <Mail className="mr-2 h-4 w-4" /> Login with Email
                </Link>
              </Button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
