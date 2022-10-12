-- CreateTable
CREATE TABLE "User" (
    "userId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userName" TEXT NOT NULL,
    "userEmailId" TEXT NOT NULL,
    "userPassword" TEXT NOT NULL,
    "userRole" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdDate" DATETIME,
    "profilePhoto" TEXT
);

-- CreateTable
CREATE TABLE "ProductType" (
    "productTypeId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productTypeName" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ProductStock" (
    "productStockId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category" TEXT NOT NULL,
    "productSuplier" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productQty" INTEGER NOT NULL,
    "totalCost" INTEGER NOT NULL,
    "costPerUnit" INTEGER NOT NULL,
    "purchaseDate" DATETIME NOT NULL,
    "productTypeId_fk" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "SaleProduct" (
    "saleProductId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productQty" INTEGER NOT NULL,
    "totalCost" INTEGER NOT NULL,
    "costPerUnit" INTEGER NOT NULL,
    "saleDate" TEXT NOT NULL,
    "saleTime" TEXT NOT NULL,
    "productTypeId_fk" INTEGER NOT NULL,
    "productType" TEXT NOT NULL,
    "productPrice" INTEGER NOT NULL,
    "discountPercentage" INTEGER NOT NULL,
    "discountPrice" INTEGER NOT NULL,
    "customerDetailsId_fk" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "CustomerDetails" (
    "customerDetailsId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerName" TEXT NOT NULL,
    "customerAddress" TEXT NOT NULL,
    "customerMobileNo" TEXT NOT NULL
);
