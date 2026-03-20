import { prisma } from "../../lib/prisma";

export const locationsRepository = {
  findAll: (tenantId?: string) =>
    prisma.location.findMany({
      where: tenantId ? { tenantId } : undefined,
      orderBy: [{ isMain: "desc" }, { name: "asc" }],
    }),
  findById: (id: string) => prisma.location.findUnique({ where: { id } }),
  countByTenant: (tenantId: string) =>
    prisma.location.count({ where: { tenantId } }),
  create: (data: {
    tenantId: string;
    name: string;
    address?: string;
    isMain?: boolean;
  }) => prisma.location.create({ data }),
  update: (id: string, data: { name?: string; address?: string; isMain?: boolean }) =>
    prisma.location.update({ where: { id }, data }),
  unsetMainForTenant: (tenantId: string) =>
    prisma.location.updateMany({
      where: { tenantId },
      data: { isMain: false },
    }),
  delete: (id: string) => prisma.location.delete({ where: { id } }),
};
