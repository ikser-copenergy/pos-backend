import { prisma } from "../../lib/prisma";

export const purchasesRepository = {
  findAll: (tenantId?: string) =>
    prisma.purchase.findMany({
      where: tenantId ? { tenantId } : undefined,
      include: { items: true, supplier: true },
    }),
  findById: (id: string) =>
    prisma.purchase.findUnique({
      where: { id },
      include: { items: true, supplier: true },
    }),
};
