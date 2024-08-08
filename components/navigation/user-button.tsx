"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function UserButton({ user }: Session) {
  return (
    <div className="flex justify-evenly px-2 w-44 items-center">
      <Avatar className="cursor-pointer">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      {/* sign out button is only for now  */}
      <button onClick={() => signOut()}>sign out</button>
    </div>
  );
}
