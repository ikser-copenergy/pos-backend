import { inventoryRepository } from "./inventory.repository";

export const inventoryService = {
  getAll: (tenantId?: string) => inventoryRepository.findAll(tenantId),
  getById: (id: string) => inventoryRepository.findById(id),
  findByProductAndLocation: (productId: string, locationId: string) =>
    inventoryRepository.findByProductAndLocation(productId, locationId),
  create: (data: {
    tenantId: string;
    productId: string;
    variantId?: string;
    locationId: string;
    quantity?: number;
  }) => inventoryRepository.create(data),
  update: (id: string, data: { quantity?: number }) =>
    inventoryRepository.update(id, data),
  delete: (id: string) => inventoryRepository.delete(id),
};
