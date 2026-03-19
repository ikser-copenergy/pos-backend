import { invoicesRepository } from "./invoices.repository";

export const invoicesService = {
  getAll: (tenantId?: string) => invoicesRepository.findAll(tenantId),
  getById: (id: string) => invoicesRepository.findById(id),
  findBySaleId: (saleId: string) => invoicesRepository.findBySaleId(saleId),

  createFromSale: async (data: {
    tenantId: string;
    saleId: string;
    total: number;
    tax?: number;
    customerName?: string;
    customerRTN?: string;
  }) => {
    const existing = await invoicesRepository.findBySaleId(data.saleId);
    if (existing) {
      throw new Error("Esta venta ya tiene una factura generada");
    }

    const number = await invoicesRepository.getNextNumber(data.tenantId);

    return invoicesRepository.create({
      tenantId: data.tenantId,
      saleId: data.saleId,
      number,
      customerName: data.customerName,
      customerRTN: data.customerRTN,
      total: data.total,
      tax: data.tax,
    });
  },
};
