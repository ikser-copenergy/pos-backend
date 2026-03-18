import { productsRepository } from "./products.repository";

export const productsService = {
  getAll: (tenantId?: string) => productsRepository.findAll(tenantId),
  getById: (id: string) => productsRepository.findById(id),
};
