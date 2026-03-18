import { prisma } from "../../lib/prisma";

export const locationsRepository = {
  findAll: (tenantId?: string) =>
    prisma.location.findMany({ where: tenantId ? { tenantId } : undefined }),
  findById: (id: string) => prisma.location.findUnique({ where: { id } }),
};
