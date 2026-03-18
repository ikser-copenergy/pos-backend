import { prisma } from "../../lib/prisma";

export const categoriesRepository = {
  findAll: (tenantId?: string) =>
    prisma.category.findMany({ where: tenantId ? { tenantId } : undefined }),
  findById: (id: string) => prisma.category.findUnique({ where: { id } }),
  create: (data: { tenantId: string; name: string; parentId?: string }) =>
    prisma.category.create({ data }),
  update: (id: string, data: { name?: string; parentId?: string }) =>
    prisma.category.update({ where: { id }, data }),
  delete: (id: string) => prisma.category.delete({ where: { id } }),
};
