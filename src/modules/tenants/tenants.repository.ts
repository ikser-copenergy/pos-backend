import { prisma } from "../../lib/prisma";

export const tenantsRepository = {
  findAll: () => prisma.tenant.findMany(),
  findById: (id: string) => prisma.tenant.findUnique({ where: { id } }),
  findBySubdomain: (subdomain: string) =>
    prisma.tenant.findUnique({ where: { subdomain } }),
};
