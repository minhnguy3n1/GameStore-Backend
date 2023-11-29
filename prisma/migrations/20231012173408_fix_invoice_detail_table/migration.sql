/*
  Warnings:

  - You are about to drop the column `Code` on the `InvoiceDetail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InvoiceDetail" DROP COLUMN "Code",
ADD COLUMN     "code" TEXT[];
