ALTER TABLE "images_variants" ALTER COLUMN "variantID" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "tags_variants" ALTER COLUMN "variantID" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "product_variants" ALTER COLUMN "productID" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "product_variants" ALTER COLUMN "productID" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "productID" SET DATA TYPE serial;