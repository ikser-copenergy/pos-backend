import { prisma } from "../../lib/prisma";

export const salesRepository = {
  findAll: (tenantId?: string) =>
    prisma.sale.findMany({
      where: tenantId ? { tenantId } : undefined,
      include: { items: true, payments: true, customer: true },
    }),
  findById: (id: string) =>
    prisma.sale.findUnique({
      where: { id },
      include: { items: true, payments: true, customer: true },
    }),
};
