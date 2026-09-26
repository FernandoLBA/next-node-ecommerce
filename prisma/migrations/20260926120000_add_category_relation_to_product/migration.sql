-- AlterTable
ALTER TABLE "Category" ADD COLUMN "key" TEXT;

-- AlterTable: categoryId nullable first so existing rows can be backfilled
ALTER TABLE "Product" ADD COLUMN "categoryId" UUID;

-- Create categories that exist in Product.category but not yet in Category
INSERT INTO "Category" ("id", "name", "image")
SELECT gen_random_uuid(), p."category", ''
FROM (SELECT DISTINCT "category" FROM "Product") p
WHERE NOT EXISTS (
  SELECT 1 FROM "Category" c WHERE c."name" = p."category"
);

-- Backfill categoryId by matching the category name
UPDATE "Product" p
SET "categoryId" = c."id"
FROM "Category" c
WHERE c."name" = p."category";

-- Now it can be required
ALTER TABLE "Product" ALTER COLUMN "categoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
