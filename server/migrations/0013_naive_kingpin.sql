ALTER TABLE "images_variants" DROP CONSTRAINT "images_variants_variantID_product_variants_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images_variants" ADD CONSTRAINT "images_variants_variantID_product_variants_id_fk" FOREIGN KEY ("variantID") REFERENCES "public"."product_variants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
