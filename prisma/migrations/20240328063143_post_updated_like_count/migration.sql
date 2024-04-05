/*
  Warnings:

  - You are about to drop the column `like` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "like",
ADD COLUMN     "like_count" INTEGER NOT NULL DEFAULT 0;
