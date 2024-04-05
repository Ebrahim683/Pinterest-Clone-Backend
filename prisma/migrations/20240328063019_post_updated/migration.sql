/*
  Warnings:

  - You are about to drop the column `like_count` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "like_count",
ADD COLUMN     "like" INTEGER NOT NULL DEFAULT 0;
