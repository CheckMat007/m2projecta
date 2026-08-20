-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "captureLocations" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "contactName" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "deliveryTerms" TEXT,
ADD COLUMN     "generalTerms" TEXT,
ADD COLUMN     "investmentDescription" TEXT,
ADD COLUMN     "isGenerated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "proposalDate" TIMESTAMP(3),
ADD COLUMN     "proposalTitle" TEXT,
ADD COLUMN     "serviceDescription" TEXT;
