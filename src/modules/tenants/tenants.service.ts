import { tenantsRepository } from "./tenants.repository";

export const tenantsService = {
  getAll: () => tenantsRepository.findAll(),
  getById: (id: string) => tenantsRepository.findById(id),
};
