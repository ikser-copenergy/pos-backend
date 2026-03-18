import { prisma } from "../../lib/prisma";

export const invoicesRepository = {
  findAll: (tenantId?: string) =>
    prisma.invoice.findMany({
      where: tenantId ? { tenantId } : undefined,
      include: { sale: true },
    }),
  findById: (id: string) =>
    prisma.invoice.findUnique({
      where: { id },
      include: { sale: true },
    }),
};
