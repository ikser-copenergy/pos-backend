-- Create taxes table
CREATE TABLE "Tax" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tax_pkey" PRIMARY KEY ("id")
);

-- Add taxId to products as nullable first
ALTER TABLE "Product" ADD COLUMN "taxId" TEXT;

-- Create unique index for tax names per tenant
CREATE UNIQUE INDEX "Tax_tenantId_name_key" ON "Tax"("tenantId", "name");

-- Insert a default tax per tenant
INSERT INTO "Tax" ("id", "tenantId", "name", "rate", "updatedAt")
SELECT ('tax-' || t."id"), t."id", 'Exento', 0, CURRENT_TIMESTAMP
FROM "Tenant" t;

-- Assign default tenant tax to existing products
UPDATE "Product" p
SET "taxId" = tx."id"
FROM "Tax" tx
WHERE tx."tenantId" = p."tenantId"
  AND tx."name" = 'Exento'
  AND p."taxId" IS NULL;

-- Make taxId required
ALTER TABLE "Product" ALTER COLUMN "taxId" SET NOT NULL;

-- Add foreign keys
ALTER TABLE "Tax" ADD CONSTRAINT "Tax_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Product" ADD CONSTRAINT "Product_taxId_fkey" FOREIGN KEY ("taxId") REFERENCES "Tax"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
