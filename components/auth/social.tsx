"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function Socials({ isLogin }: { isLogin: boolean }) {
  return (
    <div className="flex flex-col items-center w-full gap-4">
      <Button
        variant={"outline"}
        className="flex gap-4 w-full py-6"
        onClick={() =>
          signIn("google", {
            redirect: false,
            callbackUrl: "/",
          })
        }
      >
        <p> {isLogin ? "Sigin with Google" : "Register with Google"} </p>
        <FcGoogle className="w-5 h-5" />
      </Button>

      <Button
        variant={"outline"}
        className="flex gap-4 w-full py-6"
        onClick={() =>
          signIn("github", {
            redirect: false,
            callbackUrl: "/",
          })
        }
      >
        <p>{isLogin ? "Signin with Github" : "Register with Github"} </p>
        <FaGithub className="w-5 h-5" />
      </Button>
    </div>
  );
}
