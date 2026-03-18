import { purchasesRepository } from "./purchases.repository";

export const purchasesService = {
  getAll: (tenantId?: string) => purchasesRepository.findAll(tenantId),
  getById: (id: string) => purchasesRepository.findById(id),
};
