import { suppliersRepository } from "./suppliers.repository";

export const suppliersService = {
  getAll: (tenantId?: string) => suppliersRepository.findAll(tenantId),
  getById: (id: string) => suppliersRepository.findById(id),
};
