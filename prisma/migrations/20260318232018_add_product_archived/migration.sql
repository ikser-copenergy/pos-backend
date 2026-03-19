/*
  Warnings:

  - You are about to drop the column `defaultLocationId` on the `Tenant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tenant" DROP CONSTRAINT "Tenant_defaultLocationId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "defaultLocationId";
