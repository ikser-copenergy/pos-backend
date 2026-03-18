import { usersRepository } from "./users.repository";

export const usersService = {
  getAll: (tenantId?: string) => usersRepository.findAll(tenantId),
  getById: (id: string) => usersRepository.findById(id),
};
