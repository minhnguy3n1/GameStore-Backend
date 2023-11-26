/*
  Warnings:

  - The primary key for the `Code` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Code` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Code_productId_idx";

-- AlterTable
ALTER TABLE "Code" DROP CONSTRAINT "Code_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Code_pkey" PRIMARY KEY ("productId");
