import { salesRepository } from "./sales.repository";

export const salesService = {
  getAll: (tenantId?: string) => salesRepository.findAll(tenantId),
  getById: (id: string) => salesRepository.findById(id),
};
