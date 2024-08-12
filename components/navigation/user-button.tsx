"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import {
  DollarSign,
  LogOut,
  Moon,
  Settings,
  Sun,
  TruckIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

export default function UserButton({ user }: Session) {
  const { setTheme, theme } = useTheme();
  const [checked, setChecked] = useState<boolean>(false);
  const router = useRouter();

  function setSwtichTheme() {
    switch (theme) {
      case "light":
        setChecked(false);
        break;
      case "dark":
        setChecked(true);
        break;
      default:
        setChecked(false);
    }
  }

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
        <DropdownMenuItem
          onClick={() => router.push("/dashboard/orders")}
          className="group py-2 font-medium cursor-pointer transition-all duration-500"
        >
          <TruckIcon
            className="mr-3 group-hover:translate-x-2 transition-all duration-300 ease-in-out"
            size={14}
          />{" "}
          My Orders
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/dashboard/settings")}
          className="group py-2 font-medium cursor-pointer transition-all duration-500"
        >
          <Settings
            size={14}
            className="mr-3 group-hover:rotate-180 transition-all duration-300 ease-in-out"
          />{" "}
          Settings
        </DropdownMenuItem>
        {theme && (
          <DropdownMenuItem className="py-2 font-medium cursor-pointer transition-all duration-500 ease-in-out">
            <div
              className="flex items-center group"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative flex mr-3">
                <Sun
                  size={14}
                  className="group-hover:text-yellow-400 absolute group-hover:rotate-180 dark:scale-0 dark:-rotate-90  transition-all duration-500 ease-in-out"
                />
                <Moon
                  size={14}
                  className="group-hover:text-blue-600 dark:scale-100 scale-0 "
                />
              </div>
              <p className="dark:text-blue-500 text-secondary-foreground/75">
                {theme[0].toUpperCase() + theme.slice(1)} Mode
              </p>
              <Switch
                className="scale-75 ml-2"
                checked={checked}
                onCheckedChange={(e) => {
                  setChecked((prev) => !prev);
                  setTheme(e ? "dark" : "light");
                }}
              />
            </div>
          </DropdownMenuItem>
        )}
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
