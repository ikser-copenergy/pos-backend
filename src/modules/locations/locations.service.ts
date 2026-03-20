import { locationsRepository } from "./locations.repository";

const MAX_LOCATIONS = 3;

export const locationsService = {
  getAll: (tenantId?: string) => locationsRepository.findAll(tenantId),
  getById: (id: string) => locationsRepository.findById(id),
  create: async (data: {
    tenantId: string;
    name: string;
    address?: string;
    isMain?: boolean;
  }) => {
    const count = await locationsRepository.countByTenant(data.tenantId);
    if (count >= MAX_LOCATIONS) {
      throw new Error(`Máximo ${MAX_LOCATIONS} ubicaciones permitidas`);
    }
    const isFirst = count === 0;
    const isMain = data.isMain ?? isFirst;
    if (isMain) {
      await locationsRepository.unsetMainForTenant(data.tenantId);
    }
    return locationsRepository.create({ ...data, isMain });
  },
  update: async (
    id: string,
    data: { name?: string; address?: string; isMain?: boolean }
  ) => {
    const existing = await locationsRepository.findById(id);
    if (!existing) throw new Error("Ubicación no encontrada");
    if (data.isMain) {
      await locationsRepository.unsetMainForTenant(existing.tenantId);
    }
    return locationsRepository.update(id, data);
  },
  delete: async (id: string) => {
    const existing = await locationsRepository.findById(id);
    if (!existing) throw new Error("Ubicación no encontrada");
    const count = await locationsRepository.countByTenant(existing.tenantId);
    if (count <= 1) {
      throw new Error("Debe haber al menos una ubicación");
    }
    return locationsRepository.delete(id);
  },
};
