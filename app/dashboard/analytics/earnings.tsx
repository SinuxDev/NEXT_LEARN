"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TotalOrders } from "@/types/infer-types";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { weeklyChart } from "./weekly-chart";
import { Bar, BarChart, ResponsiveContainer, Tooltip } from "recharts";
import { monthlyCheck } from "./monthly-check";

export default function Earnings({
  totalOrders,
}: {
  totalOrders: TotalOrders[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") || "week";

  const chartItems = totalOrders.map((order) => ({
    date: order.order.created!,
    revenue: order.order.total,
  }));

  const activeChart = useMemo(() => {
    const weekly = weeklyChart(chartItems);
    const monthly = monthlyCheck(chartItems);

    if (filter === "week") {
      return weekly;
    }

    if (filter === "month") {
      return monthly;
    }
  }, [filter, chartItems]);

  const activeTotal = useMemo(() => {
    if (filter === "month") {
      return monthlyCheck(chartItems).reduce(
        (acc, item) => acc + item.revenue,
        0
      );
    }

    return weeklyChart(chartItems).reduce((acc, item) => acc + item.revenue, 0);
  }, [filter, chartItems]);

  return (
    <Card className="flex-1 shrink-0 h-full">
      <CardHeader>
        <CardTitle>Your Revenue: ${activeTotal}</CardTitle>
        <CardDescription>Here are your recent earnings</CardDescription>
        <div className="flex items-center gap-2">
          <Badge
            className={cn(
              "cursor-pointer",
              filter === "week" ? "bg-primary" : "bg-primary/25"
            )}
            onClick={() =>
              router.push("/dashboard/analytics?filter=week", {
                scroll: false,
              })
            }
          >
            This Week
          </Badge>

          <Badge
            className={cn(
              "cursor-pointer",
              filter === "month" ? "bg-primary" : "bg-primary/25"
            )}
            onClick={() =>
              router.push("/dashboard/analytics?filter=month", {
                scroll: false,
              })
            }
          >
            This Month
          </Badge>
        </div>
        <CardContent className="h-96">
          <ResponsiveContainer width={"100%"} height={"100%"}>
            <BarChart data={activeChart}>
              <Tooltip
                content={(props) => (
                  <div>
                    {props.payload?.map((item) => {
                      return (
                        <div
                          className="bg-primary py-2 px-4 rounded-md shadow-lg"
                          key={item.payload.date}
                        >
                          <p>Revenue : {item.value}</p>
                          <p>Date : {item.payload.data}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              />
              <Bar dataKey="revenue" className="fill-primary" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
