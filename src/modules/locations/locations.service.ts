import { locationsRepository } from "./locations.repository";

export const locationsService = {
  getAll: (tenantId?: string) => locationsRepository.findAll(tenantId),
  getById: (id: string) => locationsRepository.findById(id),
  create: (data: { tenantId: string; name: string; address?: string }) =>
    locationsRepository.create(data),
  update: (id: string, data: { name?: string; address?: string }) =>
    locationsRepository.update(id, data),
  delete: (id: string) => locationsRepository.delete(id),
};
