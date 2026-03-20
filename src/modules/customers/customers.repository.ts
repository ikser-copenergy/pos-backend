import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import type { CreateCustomerDto, UpdateCustomerDto } from "./customers.dto";

export const customersRepository = {
  findAll: (tenantId?: string) =>
    prisma.customer.findMany({
      where: tenantId ? { tenantId } : undefined,
      orderBy: { name: "asc" },
    }),

  getDebtByCustomerIds: async (customerIds: string[]) => {
    if (customerIds.length === 0) return new Map<string, number>();
    const rows = await prisma.$queryRaw<{ customerId: string; debt: number }[]>`
      SELECT s."customerId", 
        COALESCE(SUM(GREATEST(s.total - COALESCE(p.total_paid, 0), 0)), 0)::float as debt
      FROM "Sale" s
      LEFT JOIN (
        SELECT "saleId", SUM(amount) as total_paid 
        FROM "Payment" 
        GROUP BY "saleId"
      ) p ON p."saleId" = s.id
      WHERE s."customerId" IS NOT NULL
        AND s."customerId" IN (${Prisma.join(customerIds)})
      GROUP BY s."customerId"
    `;
    const map = new Map<string, number>();
    for (const r of rows) map.set(r.customerId, Number(r.debt));
    return map;
  },

  findAllPaginated: async (
    tenantId: string | undefined,
    page: number,
    limit: number
  ) => {
    const skip = (page - 1) * limit;
    const where = tenantId ? { tenantId } : undefined;

    const [data, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: { name: "asc" },
        skip,
        take: limit,
      }),
      prisma.customer.count({ where }),
    ]);

    const customerIds = data.map((c) => c.id);
    const debtMap = await customersRepository.getDebtByCustomerIds(customerIds);

    const dataWithDebt = data.map((c) => ({
      ...c,
      debt: debtMap.get(c.id) ?? 0,
    }));

    return {
      data: dataWithDebt,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },

  findById: (id: string) =>
    prisma.customer.findUnique({ where: { id } }),

  create: (data: CreateCustomerDto) =>
    prisma.customer.create({
      data: {
        tenantId: data.tenantId,
        name: data.name,
        phone: data.phone ?? null,
        email: data.email ?? null,
        address: data.address ?? null,
      },
    }),

  update: (id: string, data: UpdateCustomerDto) =>
    prisma.customer.update({
      where: { id },
      data: {
        ...(data.name != null && { name: data.name }),
        ...(data.phone !== undefined && { phone: data.phone ?? null }),
        ...(data.email !== undefined && { email: data.email ?? null }),
        ...(data.address !== undefined && { address: data.address ?? null }),
      },
    }),

  delete: (id: string) =>
    prisma.customer.delete({ where: { id } }),
};
