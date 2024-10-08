import ProductForm from "@/components/dashboard/products-form";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function AddProduct() {
  const session = await auth();
  if (session?.user.role !== "admin") return redirect("/dashboard/settings");

  return <ProductForm />;
}
