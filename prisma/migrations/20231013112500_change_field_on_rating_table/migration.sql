/*
  Warnings:

  - You are about to drop the column `total` on the `Rating` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "total",
ADD COLUMN     "starCount" INTEGER NOT NULL DEFAULT 0;
