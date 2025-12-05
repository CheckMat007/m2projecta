/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slug` on table `Service` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");
