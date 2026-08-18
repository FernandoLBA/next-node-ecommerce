/*
  Warnings:

  - The primary key for the `AppSetting` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "AppSetting" DROP CONSTRAINT "AppSetting_pkey",
ALTER COLUMN "key" SET DATA TYPE TEXT,
ADD CONSTRAINT "AppSetting_pkey" PRIMARY KEY ("key");
