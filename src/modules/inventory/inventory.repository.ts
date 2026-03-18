import { prisma } from "../../lib/prisma";

export const inventoryRepository = {
  findAll: (tenantId?: string) =>
    prisma.inventory.findMany({
      where: tenantId ? { tenantId } : undefined,
      include: { product: true, variant: true, location: true },
    }),
  findById: (id: string) =>
    prisma.inventory.findUnique({
      where: { id },
      include: { product: true, variant: true, location: true },
    }),
  create: (data: {
    tenantId: string;
    productId: string;
    variantId?: string;
    locationId: string;
    quantity?: number;
  }) =>
    prisma.inventory.create({
      data,
      include: { product: true, variant: true, location: true },
    }),
  update: (id: string, data: { quantity?: number }) =>
    prisma.inventory.update({
      where: { id },
      data,
      include: { product: true, variant: true, location: true },
    }),
  delete: (id: string) => prisma.inventory.delete({ where: { id } }),
};
