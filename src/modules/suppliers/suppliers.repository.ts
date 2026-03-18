import { prisma } from "../../lib/prisma";

export const suppliersRepository = {
  findAll: (tenantId?: string) =>
    prisma.supplier.findMany({ where: tenantId ? { tenantId } : undefined }),
  findById: (id: string) => prisma.supplier.findUnique({ where: { id } }),
};
