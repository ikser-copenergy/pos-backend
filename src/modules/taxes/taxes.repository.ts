import { prisma } from "../../lib/prisma";

export const taxesRepository = {
  findAll: (tenantId?: string) =>
    prisma.tax.findMany({
      where: tenantId ? { tenantId } : undefined,
      orderBy: { name: "asc" },
    }),
  findById: (id: string) => prisma.tax.findUnique({ where: { id } }),
  create: (data: { tenantId: string; name: string; rate: number }) =>
    prisma.tax.create({ data }),
  update: (id: string, data: { name?: string; rate?: number }) =>
    prisma.tax.update({ where: { id }, data }),
  delete: (id: string) => prisma.tax.delete({ where: { id } }),
};
