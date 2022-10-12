/*
  Warnings:

  - You are about to alter the column `saleTime` on the `SaleProduct` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SaleProduct" (
    "saleProductId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productQty" INTEGER NOT NULL,
    "totalCost" INTEGER NOT NULL,
    "costPerUnit" INTEGER NOT NULL,
    "saleDate" TEXT NOT NULL,
    "saleTime" DATETIME NOT NULL,
    "productTypeId_fk" INTEGER NOT NULL,
    "productType" TEXT NOT NULL,
    "productPrice" INTEGER NOT NULL,
    "discountPercentage" INTEGER NOT NULL,
    "discountPrice" INTEGER NOT NULL,
    "customerDetailsId_fk" INTEGER NOT NULL
);
INSERT INTO "new_SaleProduct" ("category", "costPerUnit", "customerDetailsId_fk", "discountPercentage", "discountPrice", "productName", "productPrice", "productQty", "productType", "productTypeId_fk", "saleDate", "saleProductId", "saleTime", "totalCost") SELECT "category", "costPerUnit", "customerDetailsId_fk", "discountPercentage", "discountPrice", "productName", "productPrice", "productQty", "productType", "productTypeId_fk", "saleDate", "saleProductId", "saleTime", "totalCost" FROM "SaleProduct";
DROP TABLE "SaleProduct";
ALTER TABLE "new_SaleProduct" RENAME TO "SaleProduct";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
