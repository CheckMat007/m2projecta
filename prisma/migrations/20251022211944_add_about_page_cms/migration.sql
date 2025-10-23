-- AlterTable
ALTER TABLE "User" ADD COLUMN     "jobDescription" TEXT,
ADD COLUMN     "showOnAboutPage" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "PageSettings" (
    "id" TEXT NOT NULL,
    "pageKey" TEXT NOT NULL,
    "heroImageUrl" TEXT,

    CONSTRAINT "PageSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutPageContent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "mainText" TEXT NOT NULL,
    "mainImageUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutPageContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PageSettings_pageKey_key" ON "PageSettings"("pageKey");
