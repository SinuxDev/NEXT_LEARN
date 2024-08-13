import DashBoardNav from "@/components/dashboard/dash-nav";
import { auth } from "@/server/auth";
import {
  BarChart,
  Package,
  PenSquare,
  Settings,
  TruckIcon,
} from "lucide-react";
import React from "react";

export default async function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userLinks = [
    {
      label: "Orders",
      path: "/dashboard/orders",
      icon: <TruckIcon size={16} />,
    },
    {
      label: "Settings",
      path: "/dashboard/settings",
      icon: <Settings size={16} />,
    },
  ] as const;

  const adminLinks = session?.user.role === "admin" && [
    {
      label: "Analytics",
      path: "/dashboard/analytics",
      icon: <BarChart size={16} />,
    },
    {
      label: "Create",
      path: "/dashboard/add-products",
      icon: <PenSquare size={16} />,
    },
    {
      label: "Analytics",
      path: "/dashboard/products",
      icon: <Package size={16} />,
    },
  ];

  const allLinks = [...(adminLinks || []), ...userLinks];

  return (
    <>
      <DashBoardNav allLinks={allLinks} />
      <div>{children}</div>
    </>
  );
}
