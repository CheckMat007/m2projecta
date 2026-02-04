-- CreateTable
CREATE TABLE "GoogleReview" (
    "id" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorPhoto" TEXT,
    "rating" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "relativeTime" TEXT NOT NULL,
    "googleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GoogleReview_googleId_key" ON "GoogleReview"("googleId");
