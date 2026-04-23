import { usersRepository } from "./users.repository";
import { MAX_CASHIERS_PER_TENANT, ROLE_CASHIER } from "../../shared/roles";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";

async function assertLocationBelongsToTenant(tenantId: string, locationId: string) {
  const loc = await prisma.location.findFirst({ where: { id: locationId, tenantId } });
  if (!loc) {
    throw new Error("La tienda seleccionada no es válida para este negocio");
  }
}

export const usersService = {
  getAll: (tenantId?: string) => usersRepository.findAll(tenantId),
  getById: (id: string) => usersRepository.findById(id),
  countCashiers: (tenantId: string) =>
    usersRepository.countByRole(tenantId, ROLE_CASHIER),
  create: async (
    tenantId: string,
    data: { name: string; email: string; password: string; phone?: string; defaultLocationId: string }
  ) => {
    const count = await usersRepository.countByRole(tenantId, ROLE_CASHIER);
    if (count >= MAX_CASHIERS_PER_TENANT) {
      throw new Error(`Máximo ${MAX_CASHIERS_PER_TENANT} cajeros permitidos`);
    }
    const existing = await usersRepository.findByEmail(data.email, tenantId);
    if (existing) throw new Error("El correo ya está registrado en este negocio");
    await assertLocationBelongsToTenant(tenantId, data.defaultLocationId);
    const hashed = await bcrypt.hash(data.password, 10);
    return usersRepository.create({
      tenantId,
      name: data.name,
      email: data.email.toLowerCase().trim(),
      password: hashed,
      phone: data.phone ?? undefined,
      role: ROLE_CASHIER,
      defaultLocationId: data.defaultLocationId,
    });
  },
  update: async (
    id: string,
    tenantId: string,
    data: {
      name?: string;
      email?: string;
      phone?: string | null;
      password?: string;
      defaultLocationId?: string;
    }
  ) => {
    const user = await usersRepository.findById(id);
    if (!user || user.tenantId !== tenantId) return null;
    if (data.email) {
      const existing = await usersRepository.findByEmail(data.email, tenantId);
      if (existing && existing.id !== id) throw new Error("El correo ya está en uso");
    }
    if (data.defaultLocationId) {
      await assertLocationBelongsToTenant(tenantId, data.defaultLocationId);
    }
    const updateData: {
      name?: string;
      email?: string;
      phone?: string | null;
      password?: string;
      defaultLocationId?: string;
    } = {
      ...data,
      email: data.email?.toLowerCase().trim(),
    };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    return usersRepository.update(id, updateData);
  },
  delete: async (id: string, tenantId: string) => {
    const user = await usersRepository.findById(id);
    if (!user || user.tenantId !== tenantId) return null;
    await usersRepository.delete(id);
    return true;
  },
};
