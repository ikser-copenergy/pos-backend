import { prisma } from "../../lib/prisma";

export const tenantsRepository = {
  findAll: () => prisma.tenant.findMany(),
  findById: (id: string) => prisma.tenant.findUnique({ where: { id } }),
  findBySubdomain: (subdomain: string) =>
    prisma.tenant.findUnique({ where: { subdomain } }),
  create: (data: { name: string; subdomain: string; logoUrl?: string }) =>
    prisma.tenant.create({ data }),
  update: (id: string, data: { name?: string; logoUrl?: string | null }) =>
    prisma.tenant.update({ where: { id }, data }),
};
