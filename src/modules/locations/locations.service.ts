import { locationsRepository } from "./locations.repository";

export const locationsService = {
  getAll: (tenantId?: string) => locationsRepository.findAll(tenantId),
  getById: (id: string) => locationsRepository.findById(id),
};
