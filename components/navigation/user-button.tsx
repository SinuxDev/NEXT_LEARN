"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Suspense } from "react";
import Image from "next/image";
import {
  DollarSign,
  LogOut,
  Moon,
  Settings,
  Sun,
  TruckIcon,
} from "lucide-react";

export default function UserButton({ user }: Session) {
  console.log(user);
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          {user?.image && user.name && (
            <Image src={user.image} alt={user.name} fill={true} />
          )}
          {!user?.image && user?.name && (
            <AvatarFallback className="bg-primary/30">
              <div className="font-bold text-white">
                {user?.name?.charAt(0)}
              </div>
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-6" align="end">
        <div className="mb-4 p-4 flex flex-col items-center rounded-lg  bg-primary/30">
          {user?.image && user.name && (
            <Image
              src={user.image}
              alt={user.name}
              width={36}
              height={36}
              className="rounded-full"
            />
          )}
          <p className="font-bold text-xs">{user?.name} </p>
          <span className="text-xs font-medium text-secondary-foreground">
            {user?.email}
          </span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="group py-2 font-medium cursor-pointer transition-all duration-500">
          <TruckIcon
            className="mr-3 group-hover:translate-x-2 transition-all duration-300 ease-in-out"
            size={14}
          />{" "}
          My Orders
        </DropdownMenuItem>
        <DropdownMenuItem className="group py-2 font-medium cursor-pointer transition-all duration-500">
          <Settings
            size={14}
            className="mr-3 group-hover:rotate-180 transition-all duration-300 ease-in-out"
          />{" "}
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="py-2 font-medium cursor-pointer transition-all duration-500">
          <div className="flex items-center">
            <Sun size={14} />
            <Moon size={14} />
            <p>
              Theme <span>theme</span>{" "}
            </p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="group py-2 font-medium cursor-pointer transition-all duration-500">
          <DollarSign
            size={14}
            className="mr-3 group-hover:rotate-180 transition-all duration-300 ease-in-out"
          />{" "}
          Subscription
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => signOut()}
          className="group py-2 font-medium cursor-pointer transition-all duration-500 focus:bg-destructive/80"
        >
          <LogOut
            size={14}
            className="mr-3 group-hover:scale-90 transition-all duration-300 ease-in-out"
          />{" "}
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
