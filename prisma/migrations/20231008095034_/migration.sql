-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isEmailValidated" BOOLEAN NOT NULL DEFAULT false,
    "dateOfBirth" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stripeCustomerId" TEXT,
    "avatarUrl" TEXT,
    "roles" TEXT[] DEFAULT ARRAY['Customer']::TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "productName" TEXT NOT NULL,
    "platformId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "available" INTEGER NOT NULL,
    "stockId" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Platform" (
    "id" SERIAL NOT NULL,
    "platformName" TEXT NOT NULL,

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "categoryName" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Code" (
    "id" SERIAL NOT NULL,
    "code" TEXT[],
    "productOptionId" INTEGER NOT NULL,

    CONSTRAINT "Code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductOption" (
    "id" SERIAL NOT NULL,
    "optionName" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ProductOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockStatus" (
    "id" SERIAL NOT NULL,
    "statusName" TEXT NOT NULL,

    CONSTRAINT "StockStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Product_productName_key" ON "Product"("productName");

-- CreateIndex
CREATE INDEX "Product_productName_idx" ON "Product"("productName");

-- CreateIndex
CREATE UNIQUE INDEX "Platform_platformName_key" ON "Platform"("platformName");

-- CreateIndex
CREATE UNIQUE INDEX "Category_categoryName_key" ON "Category"("categoryName");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "StockStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Code" ADD CONSTRAINT "Code_productOptionId_fkey" FOREIGN KEY ("productOptionId") REFERENCES "ProductOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOption" ADD CONSTRAINT "ProductOption_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
