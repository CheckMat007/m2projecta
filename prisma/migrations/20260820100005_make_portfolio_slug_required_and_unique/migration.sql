/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `PortfolioItem` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slug` on table `PortfolioItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PortfolioItem" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioItem_slug_key" ON "PortfolioItem"("slug");
