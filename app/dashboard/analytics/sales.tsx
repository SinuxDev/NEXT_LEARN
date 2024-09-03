import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TotalOrders } from "@/types/infer-types";
import Image from "next/image";
import userPlaceHolderImage from "@/public/imagePlaceholder.png";

export default function Sales({ totalOrders }: { totalOrders: TotalOrders[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Sales</CardTitle>
        <CardDescription>Check your recent sales</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Prices</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {totalOrders.map(({ order, product, quantity, productVariant }) => (
              <TableRow className="font-medium" key={order.id}>
                <TableCell>
                  {order.user.image && order.user.name ? (
                    <div className="flex gap-2 items-center">
                      <Image
                        src={order.user.image}
                        width={25}
                        height={20}
                        alt={order.user.name}
                        className="rounded-full"
                      />
                      <p className="text-xs font-medium">{order.user.name}</p>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center justify-center">
                      <Image
                        src={userPlaceHolderImage}
                        width={25}
                        height={20}
                        alt="user not found"
                        className="rounded-full"
                      />
                      <p className="text-xs font-medium">User Not Found</p>
                    </div>
                  )}
                </TableCell>

                <TableCell>{product.title}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{quantity}</TableCell>

                <TableCell>
                  <Image
                    src={productVariant.variantImages[0].url}
                    alt={product.title}
                    width={48}
                    height={48}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
