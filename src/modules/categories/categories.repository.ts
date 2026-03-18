import { prisma } from "../../lib/prisma";

export const categoriesRepository = {
  findAll: (tenantId?: string) =>
    prisma.category.findMany({ where: tenantId ? { tenantId } : undefined }),
  findById: (id: string) => prisma.category.findUnique({ where: { id } }),
};
