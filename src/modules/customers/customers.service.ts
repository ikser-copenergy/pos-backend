import { customersRepository } from "./customers.repository";

export const customersService = {
  getAll: (tenantId?: string) => customersRepository.findAll(tenantId),
  getById: (id: string) => customersRepository.findById(id),
};
