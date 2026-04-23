import { prisma } from "../../lib/prisma";
import type { UserRole } from "../../shared/roles";

export const usersRepository = {
  findAll: (tenantId?: string) =>
    prisma.user.findMany({
      where: tenantId ? { tenantId } : undefined,
      select: { id: true, name: true, email: true, phone: true, role: true, status: true, createdAt: true, tenantId: true },
    }),
  findById: (id: string) => prisma.user.findUnique({ where: { id } }),
  findByIdWithTenant: (id: string) =>
    prisma.user.findUnique({ where: { id }, include: { tenant: true } }),
  findByEmail: (email: string, tenantId: string) =>
    prisma.user.findFirst({ where: { email, tenantId } }),
  findByEmailGlobal: (email: string) =>
    prisma.user.findFirst({ where: { email }, include: { tenant: true } }),
  countByRole: (tenantId: string, role: UserRole) =>
    prisma.user.count({ where: { tenantId, role } }),
  create: (data: {
    tenantId: string;
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: UserRole;
  }) =>
    prisma.user.create({
      data,
      select: { id: true, name: true, email: true, phone: true, role: true, status: true, createdAt: true, tenantId: true },
    }),
  update: (id: string, data: { name?: string; email?: string; phone?: string | null; password?: string }) =>
    prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, phone: true, role: true, status: true, createdAt: true, tenantId: true },
    }),
  delete: (id: string) => prisma.user.delete({ where: { id } }),
};
