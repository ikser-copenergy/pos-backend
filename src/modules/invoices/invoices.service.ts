import { invoicesRepository } from "./invoices.repository";

export const invoicesService = {
  getAll: (tenantId?: string) => invoicesRepository.findAll(tenantId),
  getById: (id: string) => invoicesRepository.findById(id),
};
