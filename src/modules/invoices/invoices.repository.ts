import { prisma } from "../../lib/prisma";

const invoiceInclude = {
  sale: {
    include: {
      items: { include: { product: true, variant: true } },
      payments: true,
      customer: true,
      location: true,
      user: true,
    },
  },
};

export const invoicesRepository = {
  findAll: (tenantId?: string) =>
    prisma.invoice.findMany({
      where: tenantId ? { tenantId } : undefined,
      include: invoiceInclude,
      orderBy: { createdAt: "desc" },
    }),

  findById: (id: string) =>
    prisma.invoice.findUnique({
      where: { id },
      include: invoiceInclude,
    }),

  findBySaleId: (saleId: string) =>
    prisma.invoice.findUnique({
      where: { saleId },
      include: invoiceInclude,
    }),

  getNextNumber: async (tenantId: string): Promise<string> => {
    const last = await prisma.invoice.findFirst({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      select: { number: true },
    });
    const seq = last ? parseInt(last.number.replace(/\D/g, ""), 10) + 1 : 1;
    return `FAC-${String(seq).padStart(6, "0")}`;
  },

  create: (data: {
    tenantId: string;
    saleId: string;
    number: string;
    customerName?: string;
    customerRTN?: string;
    total: number;
    tax?: number;
  }) =>
    prisma.invoice.create({
      data: {
        tenantId: data.tenantId,
        saleId: data.saleId,
        number: data.number,
        customerName: data.customerName ?? null,
        customerRTN: data.customerRTN ?? null,
        total: data.total,
        tax: data.tax ?? null,
      },
      include: invoiceInclude,
    }),
};
