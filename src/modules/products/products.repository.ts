import { prisma } from "../../lib/prisma";

export const productsRepository = {
  findAll: (tenantId?: string) =>
    prisma.product.findMany({
      where: tenantId ? { tenantId } : undefined,
      include: { category: true, variants: true },
    }),
  findById: (id: string) =>
    prisma.product.findUnique({
      where: { id },
      include: { category: true, variants: true },
    }),
};
