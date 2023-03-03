/*
  Warnings:

  - You are about to drop the column `Avatar` on the `ProductOption` table. All the data in the column will be lost.
  - You are about to drop the column `Description` on the `ProductOption` table. All the data in the column will be lost.
  - You are about to drop the column `Price` on the `ProductOption` table. All the data in the column will be lost.
  - You are about to drop the column `Status` on the `ProductOption` table. All the data in the column will be lost.
  - Added the required column `avatar` to the `ProductOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `ProductOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `ProductOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `ProductOption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductOption" DROP COLUMN "Avatar",
DROP COLUMN "Description",
DROP COLUMN "Price",
DROP COLUMN "Status",
ADD COLUMN     "avatar" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;
