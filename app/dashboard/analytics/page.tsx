import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
import { db } from "@/server";
import { orderProduct } from "@/server/schema";
import { desc } from "drizzle-orm";
import Sales from "./sales";
import Earnings from "./earnings";

export default async function Analytics() {
  const totalOrders = await db.query.orderProduct.findMany({
    orderBy: [desc(orderProduct.id)],
    limit: 10,
    with: {
      order: { with: { user: true } },
      product: true,
      productVariant: { with: { variantImages: true } },
    },
  });

  if (totalOrders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Orders</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (totalOrders) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Analytics</CardTitle>
          <CardDescription>Check your analytics here</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col lg:flex-row gap-8">
          <Sales totalOrders={totalOrders} />
          <Earnings totalOrders={totalOrders} />
        </CardContent>
      </Card>
    );
  }
}
