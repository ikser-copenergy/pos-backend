import { prisma } from "../../lib/prisma";

export const locationsRepository = {
  findAll: (tenantId?: string) =>
    prisma.location.findMany({ where: tenantId ? { tenantId } : undefined }),
  findById: (id: string) => prisma.location.findUnique({ where: { id } }),
  create: (data: { tenantId: string; name: string; address?: string }) =>
    prisma.location.create({ data }),
  update: (id: string, data: { name?: string; address?: string }) =>
    prisma.location.update({ where: { id }, data }),
  delete: (id: string) => prisma.location.delete({ where: { id } }),
};
