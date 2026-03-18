import { prisma } from "../../lib/prisma";

export const customersRepository = {
  findAll: (tenantId?: string) =>
    prisma.customer.findMany({ where: tenantId ? { tenantId } : undefined }),
  findById: (id: string) => prisma.customer.findUnique({ where: { id } }),
};
