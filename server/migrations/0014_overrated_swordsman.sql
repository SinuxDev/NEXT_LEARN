ALTER TABLE "images_variants" DROP CONSTRAINT "images_variants_variantID_product_variants_id_fk";
--> statement-breakpoint
ALTER TABLE "images_variants" ALTER COLUMN "variantID" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "tags_variants" ALTER COLUMN "variantID" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "product_variants" ALTER COLUMN "productID" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "product_variants" ALTER COLUMN "productID" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "productID" SET DATA TYPE integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images_variants" ADD CONSTRAINT "images_variants_variantID_product_variants_id_fk" FOREIGN KEY ("variantID") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
