import { categoriesRepository } from "./categories.repository";

export const categoriesService = {
  getAll: (tenantId?: string) => categoriesRepository.findAll(tenantId),
  getById: (id: string) => categoriesRepository.findById(id),
};
