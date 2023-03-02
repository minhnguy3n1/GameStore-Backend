/*
  Warnings:

  - You are about to alter the column `Price` on the `ProductOption` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - Added the required column `productId` to the `ProductOption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductOption" ADD COLUMN     "productId" INTEGER NOT NULL,
ALTER COLUMN "Price" SET DATA TYPE DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "ProductOption" ADD CONSTRAINT "ProductOption_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
