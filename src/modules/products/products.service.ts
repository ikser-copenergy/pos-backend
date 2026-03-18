import { productsRepository } from "./products.repository";

export const productsService = {
  getAll: (tenantId?: string) => productsRepository.findAll(tenantId),
  getById: (id: string) => productsRepository.findById(id),
  create: (data: Parameters<typeof productsRepository.create>[0]) =>
    productsRepository.create(data),
  update: (
    id: string,
    data: Parameters<typeof productsRepository.update>[1]
  ) => productsRepository.update(id, data),
};
