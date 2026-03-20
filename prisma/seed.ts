import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL required");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { subdomain: "default" },
    update: {},
    create: {
      name: "Tienda Principal",
      subdomain: "default",
      plan: "free",
      status: "active",
    },
  });

  const location = await prisma.location.upsert({
    where: { id: "seed-location-1" },
    update: {},
    create: {
      id: "seed-location-1",
      tenantId: tenant.id,
      name: "Almacén Central",
      address: "Calle Principal 123",
    },
  });

  const category = await prisma.category.upsert({
    where: { id: "seed-category-1" },
    update: {},
    create: {
      id: "seed-category-1",
      tenantId: tenant.id,
      name: "General",
    },
  });

  const product = await prisma.product.upsert({
    where: { id: "seed-product-1" },
    update: {},
    create: {
      id: "seed-product-1",
      tenantId: tenant.id,
      name: "Producto de ejemplo",
      categoryId: category.id,
      type: "SIMPLE",
      unitType: "unidad",
      sku: "SKU-001",
      costPrice: 10,
      salePrice: 15,
      trackStock: true,
    },
  });

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { id: "seed-admin-1" },
    update: { password: hashedPassword },
    create: {
      id: "seed-admin-1",
      tenantId: tenant.id,
      name: "Administrador",
      email: "admin@pos.local",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const user = await prisma.user.upsert({
    where: { id: "seed-user-1" },
    update: { password: hashedPassword },
    create: {
      id: "seed-user-1",
      tenantId: tenant.id,
      name: "Usuario Caja",
      email: "caja@pos.local",
      password: hashedPassword,
      role: "CASHIER",
    },
  });

  const existing = await prisma.inventory.findFirst({
    where: {
      tenantId: tenant.id,
      productId: product.id,
      locationId: location.id,
    },
  });

  if (!existing) {
    await prisma.inventory.create({
      data: {
        tenantId: tenant.id,
        productId: product.id,
        locationId: location.id,
        quantity: 0,
      },
    });
  }

  await prisma.setting.upsert({
    where: {
      tenantId_key: { tenantId: tenant.id, key: "businessName" },
    },
    update: {},
    create: { tenantId: tenant.id, key: "businessName", value: "Tienda Principal" },
  });
  await prisma.setting.upsert({
    where: {
      tenantId_key: { tenantId: tenant.id, key: "currency" },
    },
    update: {},
    create: { tenantId: tenant.id, key: "currency", value: "L" },
  });

  console.log("Seed completado:", {
    tenant: tenant.name,
    location: location.name,
    product: product.name,
    admin: `${admin.email} / admin123`,
    user: `${user.email} / admin123`,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
