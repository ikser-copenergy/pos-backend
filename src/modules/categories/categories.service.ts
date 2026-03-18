import { categoriesRepository } from "./categories.repository";

export const categoriesService = {
  getAll: (tenantId?: string) => categoriesRepository.findAll(tenantId),
  getById: (id: string) => categoriesRepository.findById(id),
  create: (data: { tenantId: string; name: string; parentId?: string }) =>
    categoriesRepository.create(data),
  update: (id: string, data: { name?: string; parentId?: string }) =>
    categoriesRepository.update(id, data),
  delete: (id: string) => categoriesRepository.delete(id),
};
