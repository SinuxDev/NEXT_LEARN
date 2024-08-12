import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import SettingCard from "./settings-card";

export default async function Settings() {
  const session = await auth();

  if (!session) redirect("/auth/login");

  if (session) {
    return <SettingCard session={session} />;
  }
}
