-- AlterTable
ALTER TABLE "Follow" ALTER COLUMN "follower_id" DROP NOT NULL,
ALTER COLUMN "following_id" DROP NOT NULL;
