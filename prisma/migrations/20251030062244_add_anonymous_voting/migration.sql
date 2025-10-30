-- DropIndex
DROP INDEX "public"."PostVote_userId_postId_key";

-- AlterTable
ALTER TABLE "PostVote" ADD COLUMN     "voterId" UUID,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "PostVote_voterId_postId_idx" ON "PostVote"("voterId", "postId");
