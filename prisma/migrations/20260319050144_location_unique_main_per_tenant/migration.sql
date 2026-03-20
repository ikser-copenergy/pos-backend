-- Corregir datos: si hay varios main por tenant, dejar solo el primero
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY "tenantId" ORDER BY "createdAt" ASC) as rn
  FROM "Location"
  WHERE "isMain" = true
)
UPDATE "Location"
SET "isMain" = false
WHERE id IN (SELECT id FROM ranked WHERE rn > 1);

-- Garantizar que solo una ubicación sea principal por tenant
CREATE UNIQUE INDEX "Location_one_main_per_tenant" ON "Location" ("tenantId") WHERE "isMain" = true;