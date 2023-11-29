/*
  Warnings:

  - You are about to drop the column `productOptionId` on the `Code` table. All the data in the column will be lost.
  - The primary key for the `InvoiceDetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `productOptionId` on the `InvoiceDetail` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the `ProductOption` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productId` to the `Code` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `InvoiceDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userFullName` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Code" DROP CONSTRAINT "Code_productOptionId_fkey";

-- DropForeignKey
ALTER TABLE "InvoiceDetail" DROP CONSTRAINT "InvoiceDetail_productOptionId_fkey";

-- DropForeignKey
ALTER TABLE "ProductOption" DROP CONSTRAINT "ProductOption_productId_fkey";

-- AlterTable
ALTER TABLE "Code" DROP COLUMN "productOptionId",
ADD COLUMN     "productId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "InvoiceDetail" DROP CONSTRAINT "InvoiceDetail_pkey",
DROP COLUMN "productOptionId",
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD CONSTRAINT "InvoiceDetail_pkey" PRIMARY KEY ("invoiceId", "productId");

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "available" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "userName",
ADD COLUMN     "userFullName" TEXT NOT NULL;

-- DropTable
DROP TABLE "ProductOption";

-- AddForeignKey
ALTER TABLE "Code" ADD CONSTRAINT "Code_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceDetail" ADD CONSTRAINT "InvoiceDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
