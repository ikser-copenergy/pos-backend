import { prisma } from "../../lib/prisma";

const saleInclude = {
  items: { include: { product: true, variant: true } },
  payments: true,
  customer: true,
  location: true,
  user: true,
};

export const salesRepository = {
  findAll: (tenantId?: string) =>
    prisma.sale.findMany({
      where: tenantId ? { tenantId } : undefined,
      include: saleInclude,
      orderBy: { createdAt: "desc" },
    }),
  findById: (id: string) =>
    prisma.sale.findUnique({
      where: { id },
      include: saleInclude,
    }),
};
