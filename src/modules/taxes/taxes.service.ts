import { taxesRepository } from "./taxes.repository";

export const taxesService = {
  getAll: (tenantId?: string) => taxesRepository.findAll(tenantId),
  getById: (id: string) => taxesRepository.findById(id),
  create: (data: { tenantId: string; name: string; rate: number }) =>
    taxesRepository.create(data),
  update: (id: string, data: { name?: string; rate?: number }) =>
    taxesRepository.update(id, data),
  delete: (id: string) => taxesRepository.delete(id),
};
