/*
  Warnings:

  - You are about to drop the `RefeshToken` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `stripeCustomerId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stripeCustomerId" TEXT NOT NULL;

-- DropTable
DROP TABLE "RefeshToken";
