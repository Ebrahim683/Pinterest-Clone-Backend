/*
  Warnings:

  - You are about to drop the column `folowers` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `folowing` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "folowers",
DROP COLUMN "folowing",
ADD COLUMN     "followers" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "following" INTEGER NOT NULL DEFAULT 0;
