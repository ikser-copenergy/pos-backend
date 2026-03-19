import { prisma } from "../../lib/prisma";

export const usersRepository = {
  findAll: (tenantId?: string) =>
    prisma.user.findMany({ where: tenantId ? { tenantId } : undefined }),
  findById: (id: string) => prisma.user.findUnique({ where: { id } }),
  findByIdWithTenant: (id: string) =>
    prisma.user.findUnique({ where: { id }, include: { tenant: true } }),
  findByEmail: (email: string, tenantId: string) =>
    prisma.user.findFirst({ where: { email, tenantId } }),
  findByEmailGlobal: (email: string) =>
    prisma.user.findFirst({ where: { email }, include: { tenant: true } }),
};
