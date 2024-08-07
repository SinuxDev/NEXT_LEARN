import { auth } from "@/server/auth";
import Logo from "@/components/navigation/logo";
import UserButton from "./user-button";

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
              <>Lee Type </>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
