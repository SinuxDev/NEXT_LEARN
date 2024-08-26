import ProductPick from "@/components/products/product-pick";
import ProductTypes from "@/components/products/product-types";
import { Separator } from "@/components/ui/separator";
import { PriceFormatter } from "@/lib/price-formatter";
import { db } from "@/server";
import { productVariants } from "@/server/schema";
import { eq } from "drizzle-orm";

export async function generateStaticParams() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });

  if (data) {
    const slugID = data.map((variant) => ({
      slug: variant.id.toString(),
    }));

    return slugID;
  }

  return [];
}

export default async function Page({ params }: { params: { slug: string } }) {
  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, parseInt(params.slug)),
    with: {
      product: {
        with: {
          productVariants: {
            with: {
              variantImages: true,
              variantTags: true,
            },
          },
        },
      },
    },
  });

  if (variant) {
    return (
      <main>
        <section>
          <div className="flex-1">
            <h1>Images</h1>
          </div>
          <div className="flex gap-2 flex-col flex-1">
            <h2 className=""> {variant?.product.title} </h2>
            <div>
              <ProductTypes variants={variant.product.productVariants} />
            </div>
            <Separator />
            <p className="text-2xl font-medium">
              {PriceFormatter(variant.product.price)}
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: variant.product.description }}
            ></div>
            <p className="text-secondary-foreground">Available Colors</p>
            <div className="flex gap-4">
              {variant.product.productVariants.map((prodVariant) => (
                <ProductPick
                  key={prodVariant.id}
                  productID={variant.productID}
                  productType={prodVariant.productType}
                  id={prodVariant.id}
                  price={variant.product.price}
                  title={variant.product.title}
                  image={prodVariant.variantImages[0].url}
                  color={prodVariant.color}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }
}
