import { inventoryRepository } from "./inventory.repository";

export const inventoryService = {
  getAll: (tenantId?: string) => inventoryRepository.findAll(tenantId),
  getById: (id: string) => inventoryRepository.findById(id),
};
