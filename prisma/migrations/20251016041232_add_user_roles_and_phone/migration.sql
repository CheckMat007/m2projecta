-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MASTER', 'EDITOR');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'EDITOR';
