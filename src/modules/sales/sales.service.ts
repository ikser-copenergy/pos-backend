import { prisma } from "../../lib/prisma";
import { salesRepository } from "./sales.repository";

export const salesService = {
  getAll: (tenantId?: string) => salesRepository.findAll(tenantId),
  getById: (id: string) => salesRepository.findById(id),

  addPayment: async (
    saleId: string,
    data: { method: string; amount: number; reference?: string }
  ) => {
    const sale = await salesRepository.findById(saleId);
    if (!sale) throw new Error("Venta no encontrada");

    const paidTotal = sale.payments.reduce((s, p) => s + p.amount, 0);
    const newTotal = paidTotal + data.amount;
    if (newTotal > sale.total + 0.01) {
      throw new Error(
        `El pago supera el saldo pendiente. Saldo: L${(sale.total - paidTotal).toFixed(2)}`
      );
    }

    const updated = await prisma.sale.update({
      where: { id: saleId },
      data: {
        payments: {
          create: {
            method: data.method as "CASH" | "TRANSFER" | "CARD",
            amount: data.amount,
            reference: data.reference ?? null,
          },
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
    return updated;
  },

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
