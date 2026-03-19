import { inventoryService } from "../inventory/inventory.service";
import { productsRepository } from "./products.repository";

type CreateProductData = Parameters<typeof productsRepository.create>[0];
type UpdateProductData = Parameters<typeof productsRepository.update>[1];

export const productsService = {
  getAll: (tenantId?: string, includeArchived?: boolean) =>
    productsRepository.findAll(tenantId, includeArchived),
  getById: (id: string) => productsRepository.findById(id),
  create: async (
    data: CreateProductData & {
      inventoryByLocation?: { locationId: string; quantity: number }[];
    }
  ) => {
    const { inventoryByLocation, ...productData } = data;
    const product = await productsRepository.create(productData);
    if (inventoryByLocation?.length) {
      for (const { locationId, quantity } of inventoryByLocation) {
        await inventoryService.create({
          tenantId: product.tenantId,
          productId: product.id,
          locationId,
          quantity: quantity ?? 0,
        });
      }
    }
    return productsRepository.findById(product.id);
  },
  update: async (
    id: string,
    data: UpdateProductData & {
      inventoryByLocation?: { locationId: string; quantity: number }[];
    }
  ) => {
    const { inventoryByLocation, ...productData } = data;
    const product = await productsRepository.update(id, productData);
    if (inventoryByLocation?.length) {
      for (const { locationId, quantity } of inventoryByLocation) {
        const existing = await inventoryService.findByProductAndLocation(
          id,
          locationId
        );
        const qty = quantity ?? 0;
        if (existing) {
          await inventoryService.update(existing.id, { quantity: qty });
        } else {
          await inventoryService.create({
            tenantId: product.tenantId,
            productId: id,
            locationId,
            quantity: qty,
          });
        }
      }
    }
    return productsRepository.findById(id);
  },
};
