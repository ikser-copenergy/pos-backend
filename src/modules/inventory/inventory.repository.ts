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
};
