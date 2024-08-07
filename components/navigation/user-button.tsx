"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";

export default function UserButton({ user }: Session) {
  return (
    <div>
      <h1>{user?.name}</h1>
      <button onClick={() => signOut()}>sign out</button>
    </div>
  );
}
