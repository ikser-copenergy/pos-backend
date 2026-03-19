import { prisma } from "../../lib/prisma";
import { salesRepository } from "./sales.repository";

export const salesService = {
  getAll: (tenantId?: string) => salesRepository.findAll(tenantId),
  getById: (id: string) => salesRepository.findById(id),
  create: async (data: {
    tenantId: string;
    locationId: string;
    userId: string;
    customerId?: string;
    total: number;
    tax?: number;
    discount?: number;
    status?: string;
    items: { productId: string; variantId?: string; quantity: number; unitPrice: number; total: number }[];
    payments: { method: string; amount: number; reference?: string }[];
  }) => {
    return prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          tenantId: data.tenantId,
          locationId: data.locationId,
          userId: data.userId,
          customerId: data.customerId || null,
          total: data.total,
          tax: data.tax ?? null,
          discount: data.discount ?? null,
          status: data.status ?? "COMPLETED",
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId ?? null,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.total,
            })),
          },
          payments: {
            create: data.payments.map((p) => ({
              method: p.method as "CASH" | "TRANSFER" | "CARD",
              amount: p.amount,
              reference: p.reference ?? null,
            })),
          },
        },
        include: {
          items: { include: { product: true, variant: true } },
          payments: true,
          customer: true,
          location: true,
          user: true,
          invoice: true,
        },
      });

      for (const item of data.items) {
        const inventory = await tx.inventory.findFirst({
          where: {
            tenantId: data.tenantId,
            productId: item.productId,
            locationId: data.locationId,
            variantId: item.variantId ?? null,
          },
        });
        if (inventory) {
          await tx.inventory.update({
            where: { id: inventory.id },
            data: { quantity: { decrement: item.quantity } },
          });
        }
      }

      return sale;
    });
  },
};
