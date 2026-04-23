-- French locale fields (nullable; existing rows remain valid)
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "nameFr" TEXT;
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "homeDescriptionFr" TEXT;
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "productPageDescriptionFr" TEXT;

ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "nameFr" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "descriptionFr" TEXT;
