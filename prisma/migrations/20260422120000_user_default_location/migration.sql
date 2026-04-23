-- AlterTable: optional column first, then backfill, then NOT NULL and FK
ALTER TABLE "User" ADD COLUMN "defaultLocationId" TEXT;

UPDATE "User" u
SET "defaultLocationId" = sub."locId"
FROM (
  SELECT
    u2."id" AS "uid",
    (
      SELECT l."id"
      FROM "Location" l
      WHERE l."tenantId" = u2."tenantId"
      ORDER BY l."isMain" DESC, l."createdAt" ASC
      LIMIT 1
    ) AS "locId"
  FROM "User" u2
) sub
WHERE u."id" = sub."uid" AND (u."defaultLocationId" IS NULL);

ALTER TABLE "User" ALTER COLUMN "defaultLocationId" SET NOT NULL;

ALTER TABLE "User" ADD CONSTRAINT "User_defaultLocationId_fkey" FOREIGN KEY ("defaultLocationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
