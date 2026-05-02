import { customersRepository } from "./customers.repository";
import type { CreateCustomerDto, UpdateCustomerDto } from "./customers.dto";

export const customersService = {
  getAll: (tenantId?: string, search?: string) =>
    customersRepository.findAll(tenantId, search),
  getAllPaginated: (tenantId: string | undefined, page: number, limit: number) =>
    customersRepository.findAllPaginated(tenantId, page, limit),
  getById: (id: string) => customersRepository.findById(id),
  create: (data: CreateCustomerDto) => customersRepository.create(data),
  update: (id: string, data: UpdateCustomerDto) =>
    customersRepository.update(id, data),
  delete: (id: string) => customersRepository.delete(id),
};
