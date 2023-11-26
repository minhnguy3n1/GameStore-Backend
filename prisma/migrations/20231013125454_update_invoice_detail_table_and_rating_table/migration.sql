/*
  Warnings:

  - The primary key for the `InvoiceDetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `InvoiceDetail` table. All the data in the column will be lost.
  - The primary key for the `Rating` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Review` table. All the data in the column will be lost.
  - Added the required column `avatarUrl` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_userId_fkey";

-- AlterTable
ALTER TABLE "InvoiceDetail" DROP CONSTRAINT "InvoiceDetail_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "InvoiceDetail_pkey" PRIMARY KEY ("invoiceId", "productOptionId");

-- AlterTable
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Rating_pkey" PRIMARY KEY ("name", "productId");

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "userId",
ADD COLUMN     "avatarUrl" TEXT NOT NULL,
ADD COLUMN     "userName" TEXT NOT NULL;
